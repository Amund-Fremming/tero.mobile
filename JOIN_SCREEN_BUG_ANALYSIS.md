# Join Screen Bug - Analyse av alle muligheter

## Problem beskrivelse

Når en spiller bruker join screen og blir med i et spill:
- `isHost` settes eksplisitt til `false` i JoinScreen
- En knapp som bare host skal kunne se, rendres likevel for spillere som ikke er host
- Når spiller 2 blir med, ser de knappen (selv om de ikke er host)
- Når spiller 3 blir med, mister spiller 2 knappen (fordi ny host info pushes på channel)
- Backend sender riktig ID
- `iterations` fungerer korrekt med samme mønster (viser at push-mekanismen fungerer)

## Identifiserte forskjeller mellom spillene

### Quiz Game LobbyScreen
- **MANGLER** listener for `"host"` channel
- Bruker bare `isHost` fra GlobalSessionProvider direkte
- Får `iterations` korrekt fordi det lytter til `HubChannel.Iterations`

### SpinGame og Imposter LobbyScreen
- **HAR** listener for `"host"` channel
- Oppdaterer `isHost` når ny host-melding kommer fra backend
- SpinGame bruker `===` (strict equality)
- Imposter bruker `==` (loose equality)

## Alle mulige årsaker til buggen (rangert etter sannsynlighet)

### 1. ⭐⭐⭐⭐⭐ QuizGame mangler host listener (HØYEST SANNSYNLIGHET)

**Beskrivelse:** QuizGame's LobbyScreen lytter ikke til `"host"` channel i det hele tatt.

**Bevis:**
- I `src/quizGame/screens/LobbyScreen/LobbyScreen.tsx` (linjer 46-67): Ingen `setListener("host", ...)` 
- Andre spill (SpinGame, Imposter) har denne listeneren

**Konsekvens:**
- Når en spiller joiner, settes `isHost` til `false` i JoinScreen
- QuizGame LobbyScreen får aldri oppdatert `isHost` fra backend
- Første spiller (host) som joiner får ikke oppdatert sin `isHost` status
- Når spiller 2 joiner, sender backend ny host-melding, men QuizGame lytter ikke til den
- Dette forklarer hvorfor `iterations` fungerer (det har en listener) men `isHost` ikke gjør det

**Fix:** Legg til host listener i QuizGame LobbyScreen slik som i SpinGame/Imposter.

---

### 2. ⭐⭐⭐⭐ Race condition i GlobalSessionProvider state

**Beskrivelse:** `isHost` state i GlobalSessionProvider oppdateres ikke før komponenten renderer første gang.

**Bevis:**
- I `JoinScreen.tsx` (linje 28): `setIsHost(false)` kalles i `useEffect`
- I `JoinScreen.tsx` (linje 32): `setIsHost(false)` kalles igjen før join
- Men GlobalSessionProvider default state er `false` (linje 45 i GlobalSessionProvider.tsx)

**Konsekvens:**
- Det kan være en race condition hvor komponenten leser gammel `isHost` verdi før oppdateringen fra backend kommer
- Spesielt hvis `setListener("host", ...)` ikke er satt opp før `ConnectToGroup` kalles

**Fix:** 
- Sørg for at alle listeners er satt opp FØR `ConnectToGroup` kalles
- Eller, vent på initial host-melding før rendering

---

### 3. ⭐⭐⭐⭐ Type mismatch mellom hostId og pseudoId

**Beskrivelse:** `hostId` fra backend og `pseudoId` lokalt kan ha forskjellige typer.

**Bevis:**
- I SpinGame LobbyScreen (linjer 52-54): Type debugging viser at type-checking er et problem
- Imposter bruker `==` (loose equality) på linje 47
- SpinGame bruker `===` (strict equality) på linje 57

**Konsekvens:**
- Hvis backend sender `hostId` som number men `pseudoId` er string (eller omvendt), vil `===` feile
- Dette kan føre til at `isHost` aldri settes til `true` selv når spilleren faktisk er host
- Spiller 2 og 3 vil alle få `isHost = false` uansett

**Fix:**
- Bruk konsistent type-konvertering (f.eks. `String(hostId) === String(pseudoId)`)
- Eller bruk `==` hvis typer kan variere

---

### 4. ⭐⭐⭐ Closure problem i setListener callback

**Beskrivelse:** `pseudoId` i listener callback kan være stale (gammel verdi) når callbacken kjører.

**Bevis:**
- I SpinGame LobbyScreen (linje 48): `const currentPseudoId = pseudoId;` - de prøver eksplisitt å capture verdien
- Imposter LobbyScreen (linje 47): Bruker `pseudoId` direkte uten capture

**Konsekvens:**
- Hvis `pseudoId` endres etter at listener er satt opp, vil sammenligningen bruke gammel verdi
- Dette kan føre til feil `isHost` status for alle spillere

**Fix:**
- Capture `pseudoId` ved call time, som SpinGame gjør
- Eller bruk `useRef` for å alltid ha nyeste verdi

---

### 5. ⭐⭐⭐ setListener overskriver eksisterende listeners

**Beskrivelse:** I HubConnectionProvider (linje 194): `connectionRef.current.off(channel)` fjerner gamle listeners før nye settes.

**Konsekvens:**
- Hvis `setListener("host", ...)` kalles flere ganger, overskriver den seg selv
- Hvis reconnection skjer, kan listeners bli satt opp på nytt med feil context
- Dette kan føre til at noen spillere mister host-status oppdateringer

**Fix:**
- Sørg for at listeners kun settes opp én gang per connection
- Eller ha en mekanisme for å bevare listener state under reconnection

---

### 6. ⭐⭐ Timing: Host melding sendes før listener er klar

**Beskrivelse:** Backend sender `"host"` melding umiddelbart når spiller kobler til, men listener er ikke satt opp enda.

**Bevis:**
- I alle LobbyScreens: `setListener` kalles FØR `invokeFunction("ConnectToGroup", ...)`
- Men hvis SignalR connection ikke er fullt etablert, kan meldinger gå tapt

**Konsekvens:**
- Første host-melding går tapt fordi listener ikke er klar
- Spillere får aldri oppdatert sin `isHost` status
- Når spiller 2 joiner, sendes ny host-melding, og spiller 1 får oppdatering (hvis listener er klar nå)

**Fix:**
- Vent på connection.start() å fullføre FØR listeners settes
- Eller, be backend om å re-sende host info etter ConnectToGroup

---

### 7. ⭐⭐ SimpleInitScreen mottar feil isHost prop

**Beskrivelse:** `SimpleInitScreen` komponenten får feil `isHost` verdi via props.

**Bevis:**
- SpinGame LobbyScreen (linje 159): sender `isHost={isHost}` til SimpleInitScreen
- Imposter LobbyScreen (linje 138-154): MANGLER `isHost` prop til SimpleInitScreen!
- QuizGame LobbyScreen (linje 127): sender `isHost={isHost}` til SimpleInitScreen

**Konsekvens:**
- For Imposter game: SimpleInitScreen vil bruke sin egen `isHost` fra GlobalSessionProvider
- Dette kan være forskjellig fra lokal state i LobbyScreen
- Knappen rendres basert på feil `isHost` verdi

**Fix:**
- Sørg for at `isHost` prop sendes konsistent til SimpleInitScreen i alle spill

---

### 8. ⭐⭐ Backend sender feil host ID første gang

**Beskrivelse:** Backend sender feil `hostId` første gang en spiller kobler til.

**Konsekvens:**
- Alle spillere får feil `isHost` status første gang
- Når ny spiller joiner, sender backend korrigert host info
- Dette forklarer hvorfor spiller 2 mister knappen når spiller 3 joiner

**Fix:**
- Dette er en backend bug - ikke noe som kan fikses i frontend uten backend endringer
- Workaround: Re-request host info etter ConnectToGroup

---

### 9. ⭐ React state oppdatering batching problem

**Beskrivelse:** React batcher state oppdateringer, så `setIsHost` oppdaterer ikke umiddelbart.

**Konsekvens:**
- Komponenten renderer med gammel `isHost` verdi
- Knappen vises basert på stale state

**Fix:**
- Bruk `flushSync` for å force synkron oppdatering
- Eller bruk `useLayoutEffect` for å oppdatere før render

---

### 10. ⭐ QuizGame bruker en annen backend endpoint

**Beskrivelse:** QuizGame sender ikke `pseudoId` til `ConnectToGroup`.

**Bevis:**
- QuizGame LobbyScreen (linje 70): `invokeFunction("ConnectToGroup", key)` - kun én parameter
- SpinGame/Imposter (linje 70/80): `invokeFunction("ConnectToGroup", gameKey, pseudoId)` - to parametere

**Konsekvens:**
- Backend kan ikke identifisere spilleren korrekt
- Backend sender kanskje ikke host-melding i det hele tatt for QuizGame
- Eller sender feil host ID

**Fix:**
- Send `pseudoId` som andre parameter til ConnectToGroup i QuizGame

---

### 11. ⭐ GlobalSessionProvider initial state

**Beskrivelse:** GlobalSessionProvider starter med `isHost: false` (linje 45).

**Konsekvens:**
- Alle komponenter får `isHost = false` før backend oppdaterer
- Hvis backend oppdatering feiler eller er forsinket, forblir `isHost = false`

**Fix:**
- Bruk `undefined` eller `null` som initial state for å indikere "ukjent" status
- Vis loading state til isHost er bekreftet fra backend

---

### 12. ⭐ SignalR reconnection clearing state

**Beskrivelse:** I HubConnectionProvider (linje 134): `hubConnection.onclose` kaller `clearValues()`.

**Konsekvens:**
- Hvis connection går ned og opp igjen, mister vi all state
- `isHost` resettes til `false` i GlobalSessionProvider
- Spillere mister sin host status

**Fix:**
- Bevare `isHost` state under reconnection
- Re-request host info fra backend etter reconnection

---

## Refleksjon og rangering

### Top 3 mest sannsynlige årsaker:

1. **QuizGame mangler host listener** (⭐⭐⭐⭐⭐)
   - Dette er den mest åpenbare forskjellen mellom QuizGame og andre spill
   - Forklarer hvorfor `iterations` fungerer men ikke `isHost`
   - Enkel å verifisere og fikse

2. **Race condition i GlobalSessionProvider state** (⭐⭐⭐⭐)
   - Vanlig problem i React
   - Forklarer hvorfor noen ganger fungerer det og andre ganger ikke
   - Kan være kombinert med manglende listener

3. **Type mismatch mellom hostId og pseudoId** (⭐⭐⭐⭐)
   - SpinGame har eksplisitt debugging for dette
   - Forklarer hvorfor `==` vs `===` er forskjellig i Imposter vs SpinGame
   - Kan føre til at ingen spillere får `isHost = true`

### Anbefalte debugging steg:

1. Legg til logging i alle `setListener("host", ...)` callbacks
2. Verifiser at QuizGame faktisk mottar `"host"` meldinger fra backend
3. Sjekk typen av `hostId` og `pseudoId` i konsollen
4. Sjekk timing av når listeners settes opp vs når meldinger mottas
5. Test med flere spillere og se når knappen vises/forsvinner

### Mest sannsynlige kombinerte årsak:

Det er sannsynlig at buggen skyldes en **kombinasjon** av:
- QuizGame mangler host listener (hovedårsak)
- Type mismatch eller closure problem (bidragsytende faktor)
- Race condition i state oppdateringer (bidragsytende faktor)

Løsningen er sannsynligvis å:
1. Legge til `setListener("host", ...)` i QuizGame LobbyScreen
2. Bruke konsistent type-sjekking (`String(hostId) === String(pseudoId)`)
3. Capture `pseudoId` i listener callback for å unngå closure problemer
4. Sende `pseudoId` til `ConnectToGroup` i QuizGame
