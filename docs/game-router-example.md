# Implementasjonseksempel: Dedikert Game Router

Dette dokumentet viser konkret hvordan du kan refaktorere SpinGame til å bruke dedikert Stack Navigator med handlers på wrapper-nivå.

## Før Refaktorering

### SpinGame.tsx (Nåværende)
```typescript
// State-basert routing
export const SpinGame = () => {
  const { gameEntryMode } = useGlobalSessionProvider();
  const { screen, setScreen } = useSpinSessionProvider();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
  }, []);

  switch (screen) {
    case SpinSessionScreen.Create:
      return <CreateScreen />;
    case SpinSessionScreen.Game:
      return <GameScreen />;
    case SpinSessionScreen.ActiveLobby:
      return <ActiveLobbyScreen />;
    // ...
  }
};
```

### GameScreen.tsx (Nåværende)
```typescript
export const GameScreen = () => {
  const { disconnect, setListener, invokeFunction, connect } = useHubConnectionProvider();
  
  // Handler setup i screen
  useFocusEffect(
    useCallback(() => {
      setupListeners();
      
      return () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        disconnect(); // Kan skje for tidlig eller sent
      };
    }, []),
  );
  
  const setupListeners = async () => {
    await connect(hubAddress);
    
    setListener(HubChannel.State, async (state: SpinGameState) => {
      setGameState(state);
      // ...
    });
    
    setListener("host", (hostId: string) => {
      setIsHost(hostId == pseudoId);
    });
    
    setListener("selected", (batch: string[]) => {
      setSelectedBatch(batch);
      // ...
    });
    // ... mange flere handlers
  };
  
  // UI rendering
  return <View>...</View>;
};
```

### ActiveLobbyScreen.tsx (Nåværende)
```typescript
export const ActiveLobbyScreen = () => {
  const { connect, setListener, invokeFunction } = useHubConnectionProvider();
  
  useEffect(() => {
    createHubConnecion(); // Setter opp handlers IGJEN
  }, []);
  
  const createHubConnecion = async () => {
    await connect(hubAddress);
    
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });
    
    setListener("signal_start", (_value: boolean) => {
      setScreen(SpinSessionScreen.Game); // State-basert navigasjon
    });
    
    // ... flere handlers (noen dupliserte fra GameScreen)
  };
  
  return <SimpleInitScreen ... />;
};
```

## Etter Refaktorering

### 1. SpinGame.tsx (Ny Versjon med Stack Navigator)

```typescript
import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useSpinSessionProvider } from "./context/SpinGameProvider";
import { GameEntryMode } from "../common/constants/Types";
import { HubChannel } from "@/src/common/constants/HubChannel";
import { SpinGameState } from "./constants/SpinTypes";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";

import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";
import PassiveLobbyScreen from "./screens/PassiveLobbyScreen/PassiveLobbyScreen";

const Stack = createStackNavigator();

export const SpinGame = () => {
  const { gameEntryMode, hubAddress, setIsHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { 
    clearSpinSessionValues, 
    setGameState, 
    setRoundText, 
    setSelectedBatch 
  } = useSpinSessionProvider();
  const { connect, disconnect, setListener } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();
  
  const disconnectTriggeredRef = useRef<boolean>(false);
  const handlersSetupRef = useRef<boolean>(false);

  useEffect(() => {
    // Setup handlers ÉN gang når spillet åpnes
    if (!handlersSetupRef.current) {
      handlersSetupRef.current = true;
      setupGameHandlers();
    }

    return () => {
      // Cleanup når hele spillet lukkes
      disconnectTriggeredRef.current = true;
      disconnect();
      clearSpinSessionValues();
      clearGlobalSessionValues();
    };
  }, []);

  const setupGameHandlers = async () => {
    const connectResult = await connect(hubAddress);
    if (connectResult.isError()) {
      displayErrorModal("Klarte ikke opprette tilkobling");
      return;
    }

    // Error handler
    setListener(HubChannel.Error, (message: string) => {
      displayErrorModal(message);
    });

    // State handler - brukes av både Lobby og Game screens
    setListener(HubChannel.State, async (state: SpinGameState) => {
      setGameState(state);
    });

    // Host election - brukes av begge screens
    setListener("host", (hostId: string) => {
      setIsHost(hostId === pseudoId);
    });

    // Round text updates
    setListener("round_text", (roundText: string) => {
      setRoundText(roundText);
    });

    // Selection updates
    setListener("selected", (batch: string[]) => {
      setSelectedBatch(batch);
    });

    // Game cancelled
    setListener("cancelled", async (message: string) => {
      if (disconnectTriggeredRef.current) return;
      
      await disconnect();
      displayInfoModal(message, "Spillet ble avsluttet");
    });
  };

  const getInitialRouteName = (): string => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return "Create";
      case GameEntryMode.Host:
        return "Game";
      case GameEntryMode.Participant:
      case GameEntryMode.Member:
        return "ActiveLobby";
      default:
        return "ActiveLobby";
    }
  };

  return (
    <Stack.Navigator 
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="ActiveLobby" component={ActiveLobbyScreen} />
      <Stack.Screen name="PassiveLobby" component={PassiveLobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
};

export default SpinGame;
```

### 2. GameScreen.tsx (Ny Versjon - Ren UI)

```typescript
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./gameScreenStyles";
import { useState, useRef } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import Color from "@/src/common/constants/Color";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { moderateScale } from "@/src/common/utils/dimensions";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);
  
  const disconnectTriggeredRef = useRef<boolean>(false);

  const { isHost, gameKey } = useGlobalSessionProvider();
  const {
    themeColor,
    roundText,
    selectedBatch,
    gameState,
  } = useSpinSessionProvider();
  const { invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  // Ingen connection setup! Det håndteres av wrapper
  // Reagerer kun på state endringer via context

  useEffect(() => {
    // UI-relatert side effect basert på game state
    if (gameState === SpinGameState.Finished) {
      setBgColor(Color.Gray);
    } else if (gameState === SpinGameState.RoundStarted) {
      setBgColor(themeColor);
    }
  }, [gameState]);

  useEffect(() => {
    // UI-relatert side effect basert på selection
    if (selectedBatch && pseudoId) {
      if (selectedBatch.includes(pseudoId)) {
        setBgColor(Color.Green);
      } else {
        setBgColor(Color.Red);
      }
    }
  }, [selectedBatch]);

  const handleNextRound = async () => {
    const result = await invokeFunction("NextRound", gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return;
      
      console.error(result.error);
      displayErrorModal("En feil har skjedd med forbindelsen");
      return;
    }

    const state: SpinGameState = result.value;
    if (state === SpinGameState.Finished) {
      console.debug("Host received game finished");
      setBgColor(Color.Gray);
    }
  };

  const handleStartRound = async () => {
    const channel = gameStarted ? "NextRound" : "StartRound";
    setGameStarted(false);

    const result = await invokeFunction(channel, gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return;
      
      console.error(result.error);
      displayErrorModal("En feil har skjedd med forbindelsen");
      return;
    }
  };

  const handleBackPressed = () => {
    // Ingen manual disconnect - wrapper håndterer det
    resetToHomeScreen(navigation);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
      </View>

      <Text style={{ ...styles.text }}>
        {gameState === SpinGameState.RoundStarted && isHost && roundText}
        {gameState === SpinGameState.RoundStarted && !isHost && "Gjør deg klar!"}
        {gameState === SpinGameState.RoundFinished && "Venter på ny runde"}
        {gameState === SpinGameState.Finished && "Spillet er ferdig!"}
      </Text>

      {gameState === SpinGameState.RoundStarted && isHost && (
        <Pressable onPress={handleStartRound} style={styles.button}>
          <Text style={styles.buttonText}>Start spin</Text>
        </Pressable>
      )}

      {gameState === SpinGameState.RoundFinished && isHost && (
        <Pressable style={styles.button} onPress={handleNextRound}>
          <Text style={styles.buttonText}>Ny runde</Text>
        </Pressable>
      )}

      {gameState === SpinGameState.Finished && (
        <Pressable style={styles.button} onPress={handleBackPressed}>
          <Text style={styles.buttonText}>Hjem</Text>
        </Pressable>
      )}
    </View>
  );
};
```

### 3. ActiveLobbyScreen.tsx (Ny Versjon)

```typescript
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useState } from "react";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/common/constants/Types";
import SimpleInitScreen from "@/src/common/screens/SimpleInitScreen/SimpleInitScreen";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const ActiveLobbyScreen = () => {
  const navigation: any = useNavigation();
  const { invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, isHost } = useGlobalSessionProvider();
  const {
    themeColor,
    secondaryThemeColor,
    featherIcon,
  } = useSpinSessionProvider();

  const [startGameTriggered, setStartGameTriggered] = useState<boolean>(false);
  const [round, setRound] = useState<string>("");
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);
  const [isAddingRound, setIsAddingRound] = useState<boolean>(false);

  // Ingen connection setup! Wrapper håndterer det
  // Lytter kun på state via context (iterations, players er lokale)

  const handleAddRound = async () => {
    if (isAddingRound || round === "") {
      return;
    }

    setIsAddingRound(true);
    const result = await invokeFunction("AddRound", gameKey, round);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til runde");
      setIsAddingRound(false);
      return;
    }

    setRound("");
    setIsAddingRound(false);
  };

  const handleStartGame = async () => {
    if (startGameTriggered || !isHost) {
      return;
    }

    setStartGameTriggered(true);

    let minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Minimum ${minPlayers} spillere for å starte, du har: ${players}`);
      setStartGameTriggered(false);
      return;
    }

    if (iterations < 1) {
      displayInfoModal("Minimum 10 runder for å starte spillet");
      setStartGameTriggered(false);
      return;
    }

    const startResult = await invokeFunction("StartGame", gameKey);
    if (startResult.isError()) {
      console.log(startResult.error);
      displayErrorModal("En feil skjedde når spillet skulle starte");
      setStartGameTriggered(false);
      return;
    }

    const gameReady = startResult.value;
    if (!gameReady) {
      console.log("Game not ready");
      setStartGameTriggered(false);
      return;
    }

    // Bruk Stack Navigator navigasjon
    navigation.navigate("Game");
  };

  const handleBackPressed = () => {
    // Ingen manual cleanup - wrapper håndterer det
    resetToHomeScreen(navigation);
  };

  return (
    <SimpleInitScreen
      createScreen={false}
      themeColor={themeColor}
      secondaryThemeColor={secondaryThemeColor}
      onBackPressed={handleBackPressed}
      onInfoPressed={() => {}}
      headerText="Opprett"
      topButtonText="Leggt til"
      topButtonOnChange={() => {}}
      topButtonOnPress={handleAddRound}
      bottomButtonText="Start spill"
      bottomButtonCallback={handleStartGame}
      featherIcon={featherIcon}
      iterations={iterations}
      inputPlaceholder="Taperen må..."
      inputValue={round}
      setInput={setRound}
    />
  );
};

export default ActiveLobbyScreen;
```

## Nøkkel Endringer

### 1. Handler Setup
- **Før**: Hver screen setter opp handlers i `useEffect` eller `useFocusEffect`
- **Etter**: Handlers settes opp ÉN gang i wrapper, deles via context

### 2. Navigasjon
- **Før**: State-basert med `setScreen(SpinSessionScreen.Game)`
- **Etter**: Stack Navigator med `navigation.navigate("Game")`

### 3. Cleanup
- **Før**: Hver screen må huske å disconnect og clear values
- **Etter**: Wrapper håndterer cleanup når hele spillet lukkes

### 4. Screen Ansvar
- **Før**: Screens blander UI logikk og connection management
- **Etter**: Screens er rene UI komponenter som reagerer på state

## Migrering Steg-for-Steg

### Steg 1: Oppdater SpinGame wrapper
1. Importer `createStackNavigator` fra `@react-navigation/stack`
2. Flytt all handler setup fra screens til wrapper
3. Erstatt switch-statement med `<Stack.Navigator>`

### Steg 2: Oppdater GameScreen
1. Fjern `setupListeners()` funksjon
2. Fjern `useFocusEffect` hook for connection
3. Fjern manual `disconnect()` kall
4. Bruk state fra context direkte

### Steg 3: Oppdater ActiveLobbyScreen
1. Fjern `createHubConnecion()` funksjon
2. Fjern duplicate handler setup
3. Erstatt `setScreen()` med `navigation.navigate()`

### Steg 4: Oppdater andre screens
Gjenta samme prosess for CreateScreen og PassiveLobbyScreen

### Steg 5: Test
1. Test navigasjon mellom screens
2. Verifiser at handlers fungerer korrekt
3. Test cleanup når man går ut av spillet
4. Test at ingen duplicate connections oppstår

## Potensielle Utfordringer

### 1. Context Updates
**Problem**: Screens må få updates fra wrapper  
**Løsning**: SpinSessionProvider context må oppdateres med setter-funksjoner

### 2. Navigasjon Typing
**Problem**: TypeScript typing for navigation  
**Løsning**: Definer SpinGameParamList type:

```typescript
type SpinGameParamList = {
  Create: undefined;
  ActiveLobby: undefined;
  PassiveLobby: undefined;
  Game: undefined;
};

const Stack = createStackNavigator<SpinGameParamList>();
```

### 3. Initial Route Logic
**Problem**: Forskjellig initial screen basert på gameEntryMode  
**Løsning**: Bruk `getInitialRouteName()` helper som vist over

## Konklusjon

Denne refaktoreringen gir deg:
- ✅ Klar handler lifecycle (setup én gang, cleanup én gang)
- ✅ Ingen race conditions
- ✅ Enklere debugging
- ✅ Bedre separation of concerns
- ✅ Konsistent med React Navigation best practices
- ✅ Lettere å vedlikeholde

Starten kan virke som mye arbeid, men resultatet er mye renere kode og færre bugs relatert til timing og handler management.
