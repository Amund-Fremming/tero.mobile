# Analyse av Game Handler Arkitektur

## Problem
Du har endret logikken for hvordan spill starter, og opplever at handlers blir satt opp for tidlig og fjernet for sakte. Dette fører til timing-problemer og potensielle race conditions.

## Nåværende Tilnærming

### Arkitektur Oversikt
For øyeblikket har applikasjonen følgende struktur:

1. **Hovedrouter (Hub.tsx)**: En sentral Stack Navigator som håndterer navigasjon mellom alle spill
2. **Game Wrappers**: Hver spilltype har sin egen wrapper-komponent (SpinGame.tsx, ImposterGame.tsx, QuizGame.tsx)
3. **Intern Routing**: Game wrappers har intern state-basert routing mellom forskjellige skjermer (Create, Lobby, Game)
4. **Delte Handlers**: Hub connection handlers settes opp i forskjellige skjermer basert på når de trengs

### Problemer med Nåværende Tilnærming

#### 1. **Handler Lifecycle Management**
```typescript
// Fra SpinGame/screens/GameScreen/GameScreen.tsx
useFocusEffect(
  useCallback(() => {
    setBgColor(themeColor);
    setupListeners();

    return () => {
      clearSpinSessionValues();
      clearGlobalSessionValues();
      disconnect();
    };
  }, []),
);
```

**Problemer:**
- Handlers settes opp i `useFocusEffect` som trigges hver gang skjermen får fokus
- Cleanup kjører når komponenten unmounter, men timing kan være upålitelig
- Hvis navigasjon skjer raskt, kan gamle handlers fortsatt være aktive mens nye settes opp

#### 2. **Dobbel Handler Setup**
```typescript
// ActiveLobbyScreen setter opp handlers
useEffect(() => {
  createHubConnecion();
}, []);

// GameScreen setter opp handlers IGJEN
const setupListeners = async () => {
  let connectResult = await connect(hubAddress);
  // ... setter opp listeners på nytt
};
```

**Problemer:**
- Samme connection og handlers settes opp flere ganger
- Gamle handlers fra Lobby-skjermen kan fortsatt være aktive
- Dette kan føre til duplicate events og race conditions

#### 3. **Stack-basert Navigasjon**
```typescript
// Fra Hub.tsx - alle spill er på samme nivå
<Stack.Screen name={Screen.Spin} component={SpinGame} />
<Stack.Screen name={Screen.Quiz} component={QuizGame} />
<Stack.Screen name={Screen.Imposter} component={ImposterGame} />
```

**Problemer:**
- React Navigation cacher sider når du navigerer direkte
- Dette er dokumentert i `painfull-bugs.md` som et kjent problem
- Løsningen er å bruke `resetToHomeScreen()` for å rense stacken

## Foreslått Løsning: Dedikerte Game Routers

### Konsept
Hvert spill får sin egen Stack Navigator med sin egen routing logikk, og handlers settes opp én gang på game wrapper-nivå.

### Fordeler

#### 1. **Klar Handler Lifecycle**
```typescript
// SpinGame.tsx (wrapper)
export const SpinGame = () => {
  const { connect, setListener, disconnect } = useHubConnectionProvider();
  
  useEffect(() => {
    // Sett opp handlers ÉN gang når spillet starter
    setupGameHandlers();
    
    return () => {
      // Cleanup når hele spillet avsluttes
      disconnect();
    };
  }, []);
  
  const setupGameHandlers = () => {
    // ALLE handlers for spin game settes opp her
    // Ingen child screens trenger å håndtere connection
  };
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
};
```

**Fordeler:**
- Handlers lever så lenge spillet er aktivt
- Ingen duplicate setup eller cleanup
- Child screens kan fokusere på UI logikk

#### 2. **Bedre State Management**
```typescript
// Game wrapper eier all game state og kommunikasjon
const SpinGame = () => {
  const [gameState, setGameState] = useState<SpinGameState>();
  const [players, setPlayers] = useState<Player[]>([]);
  
  const setupGameHandlers = () => {
    setListener(HubChannel.State, setGameState);
    setListener("players_count", (count) => setPlayers(count));
    // ... alle andre handlers
  };
  
  // Child screens får state via context eller props
  return (
    <SpinGameContext.Provider value={{ gameState, players }}>
      <Stack.Navigator>
        {/* ... screens */}
      </Stack.Navigator>
    </SpinGameContext.Provider>
  );
};
```

#### 3. **Enklere Navigasjon**
```typescript
// I Hub.tsx - samme som før
<Stack.Screen name={Screen.Spin} component={SpinGame} />

// Men nå har SpinGame sin egen router
// Navigasjon internt i spillet:
navigation.navigate('Lobby');
navigation.navigate('Game');

// Ut av spillet:
resetToHomeScreen(navigation); // Går til Hub home
```

### Ulemper

#### 1. **Mer Boilerplate**
- Hver game wrapper trenger sin egen Stack Navigator setup
- Må definere screen names for intern navigasjon
- Mer initial kode å skrive

**Motargument:** 
- Dette er engangsarbeid som gir bedre struktur
- Reduserer bugs og gjør koden mer vedlikeholdbar
- Mindre boilerplate totalt sett siden du slipper cleanup-logikk i hver screen

#### 2. **Dypere Navigasjons-hierarki**
```
Hub Navigator
  └─ SpinGame Navigator
      ├─ Create Screen
      ├─ Lobby Screen  
      └─ Game Screen
```

**Motargument:**
- Dette er faktisk en fordel for isolasjon
- Gjør det lettere å håndtere back-knapp logikk
- Tydelig separasjon av concerns

## Sammenligning

### Nåværende Approach: State-basert Routing

**Kode i wrapper:**
```typescript
// SpinGame.tsx
switch (screen) {
  case SpinSessionScreen.Create:
    return <CreateScreen />;
  case SpinSessionScreen.Game:
    return <GameScreen />;
  // ...
}
```

**Handlers i hver screen:**
```typescript
// GameScreen.tsx
useEffect(() => {
  setupListeners();
  return () => disconnect();
}, []);

// ActiveLobbyScreen.tsx  
useEffect(() => {
  createHubConnecion();
}, []);
```

**Problemer:**
- ❌ Handler setup duplisert i flere screens
- ❌ Uklar lifecycle - når blir handlers faktisk fjernet?
- ❌ Race conditions mulig ved rask navigasjon
- ❌ Vanskelig å debugge timing-problemer

### Foreslått: Stack Navigator per Spill

**Kode i wrapper:**
```typescript
// SpinGame.tsx
export const SpinGame = () => {
  useEffect(() => {
    setupGameHandlers();
    return () => disconnect();
  }, []);
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
};
```

**Screens er rene UI komponenter:**
```typescript
// GameScreen.tsx - ingen connection logic!
export const GameScreen = () => {
  const { gameState, handleStartRound } = useSpinGameContext();
  
  return (
    <View>
      {/* Pure UI basert på state fra context */}
    </View>
  );
};
```

**Fordeler:**
- ✅ Handlers settes opp én gang i wrapper
- ✅ Klar lifecycle - lever så lenge spillet er åpent
- ✅ Ingen race conditions
- ✅ Screens fokuserer kun på UI
- ✅ Lettere å teste
- ✅ Konsistent med React Navigation best practices

## Konklusjon

### Er din nåværende approach tungvint?
**Ja**, av følgende grunner:
1. Handler setup er spredt over flere screens
2. Duplicate connection logic
3. Timing-problemer med cleanup
4. Vanskelig å debugge lifecycle issues
5. Blanding av concerns (UI og connection management i samme komponenter)

### Vil dedikerte game routers fungere?
**Ja**, det vil fungere bedre fordi:
1. Klar separasjon av concerns
2. Handlers lever på riktig scope (game-nivå, ikke screen-nivå)
3. Konsistent med React Navigation patterns
4. Lettere å vedlikeholde og debugge

### Er det mye boilerplate?
**Nei**, faktisk mindre totalt:
- Initial setup: Litt mer kode i wrappers
- Ongoing: Mye mindre kode i screens
- Totalt: Færre linjer kode og bedre struktur

## Anbefaling

**Implementer dedikerte Stack Navigators for hvert spill:**

1. **Flytt handler setup til game wrappers** (SpinGame.tsx, ImposterGame.tsx, etc.)
2. **Lag egen Stack Navigator i hver wrapper** for intern navigasjon
3. **Fjern connection logic fra child screens** - de skal kun være UI
4. **Bruk context** for å dele state og handlers med child screens
5. **Behold `resetToHomeScreen()`** for å unngå cached screens når du går ut av spill

Dette vil løse timing-problemene dine og gi en mye renere arkitektur.

## Eksempel Implementasjon

Se `docs/game-router-example.md` for komplett implementasjonseksempel.
