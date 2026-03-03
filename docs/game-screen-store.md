# Game Screen Store

Persists the current game screen across app backgrounds/reloads.

## How it works

`useGameScreenStore` holds a single `screen` string value that represents the current screen within the active game session. The screen is cleared automatically when the game session is cleared via `clearGlobalSessionValues()` in the GlobalSessionProvider.

## Usage

Access screen state through the `GlobalSessionProvider`:

```ts
const { setGameScreen, getGameScreen } = useGlobalSessionProvider();

// Set current screen
setGameScreen("Lobby");

// Get current screen
const currentScreen = getGameScreen();
```

## Implementation Details

- **Storage**: Zustand store with AsyncStorage persistence
- **Scope**: Single active game session (one screen at a time)
- **Cleared**: Automatically when switching games or ending session
- **Type**: Stored as string, cast to appropriate screen enum in each game provider
