import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GameEntryMode, GameType } from "../../core/constants/Types";
import { registerCrashResetCallback } from "../../core/utils/navigationRef";
import { useGameScreenStore } from "../stores/gameScreenStore";

interface IGlobalSessionContext {
  gameEntryMode: GameEntryMode;
  setGameEntryMode: React.Dispatch<React.SetStateAction<GameEntryMode>>;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  gameKey: string;
  setGameKey: React.Dispatch<React.SetStateAction<string>>;
  hubName: string;
  setHubName: React.Dispatch<React.SetStateAction<string>>;
  isHost: boolean;
  setIsHost: React.Dispatch<React.SetStateAction<boolean>>;
  clearGlobalSessionValues: () => void;
  isDraft: boolean;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
  setGameScreen: (screen: string) => void;
  getGameScreen: () => string | undefined;
}

const defaultContextValue: IGlobalSessionContext = {
  gameEntryMode: GameEntryMode.Creator,
  setGameEntryMode: () => {},
  gameType: GameType.Quiz,
  setGameType: () => {},
  gameKey: "",
  setGameKey: () => {},
  hubName: "",
  setHubName: () => {},
  isHost: false,
  setIsHost: () => {},
  isDraft: false,
  setIsDraft: () => {},
  clearGlobalSessionValues: () => {},
  setGameScreen: () => {},
  getGameScreen: () => undefined,
};

const GlobalSessionContext = createContext<IGlobalSessionContext>(defaultContextValue);

export const useGlobalSessionProvider = () => useContext(GlobalSessionContext);

interface GlobalSessionProviderProps {
  children: ReactNode;
}

export const GlobalGameProvider = ({ children }: GlobalSessionProviderProps) => {
  const [gameEntryMode, setGameEntryMode] = useState<GameEntryMode>(GameEntryMode.Host);
  const [gameType, setGameType] = useState<GameType>(GameType.Quiz);
  const [gameKey, setGameKey] = useState<string>("");
  const [hubName, setHubName] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  useEffect(() => {}, [isHost]);

  useEffect(() => {
    return registerCrashResetCallback(clearGlobalSessionValues);
  }, []);

  const setGameScreen = (screen: string) => {
    useGameScreenStore.getState().setScreen(screen);
  };

  const getGameScreen = () => {
    return useGameScreenStore.getState().screen;
  };

  const clearGlobalSessionValues = () => {
    setGameEntryMode(GameEntryMode.Creator);
    setGameType(GameType.Quiz);
    setGameKey("");
    setHubName("");
    setIsHost(false);
    useGameScreenStore.getState().clearScreen();
  };

  const value = {
    clearGlobalSessionValues,
    gameEntryMode,
    setGameEntryMode,
    gameType,
    setGameType,
    gameKey,
    setGameKey,
    hubName,
    setHubName,
    isHost,
    setIsHost,
    isDraft,
    setIsDraft,
    setGameScreen,
    getGameScreen,
  };

  return <GlobalSessionContext.Provider value={value}>{children}</GlobalSessionContext.Provider>;
};

export default GlobalGameProvider;
