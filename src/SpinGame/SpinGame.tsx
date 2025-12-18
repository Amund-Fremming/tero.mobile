import React, { useEffect } from "react";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import { GameEntryMode } from "../Common/constants/Types";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import { SpinSessionScreen } from "./constants/SpinTypes";
import { useSpinGameProvider } from "./context/SpinGameProvider";

export const SpinGame = () => {
  const { gameEntryMode } = useGlobalGameProvider();
  const { screen, setScreen } = useSpinGameProvider();

  useEffect(() => {
    const initScreen = getInitialScreen();
    console.debug("SpinGame.tsx - initial screen:", initScreen);
    setScreen(initScreen);
  }, []);

  const getInitialScreen = (): SpinSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return SpinSessionScreen.Create;
      case GameEntryMode.Host:
        return SpinSessionScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return SpinSessionScreen.Lobby;
      default:
        return SpinSessionScreen.Lobby;
    }
  };

  switch (screen) {
    case SpinSessionScreen.Create:
      return <CreateScreen />;
    case SpinSessionScreen.Game:
      return <GameScreen />;
    case SpinSessionScreen.Lobby:
      return <LobbyScreen />;
    case SpinSessionScreen.Started:
      return <StartedScreen />;
    default:
      return <LobbyScreen />;
  }
};

export default SpinGame;
