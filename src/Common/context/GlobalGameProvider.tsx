import React, { createContext, ReactNode, useContext, useState } from "react";
import { GameEntryMode, GameType } from "../constants/Types";

interface IGlobalGameContext {
  gameEntryMode: GameEntryMode;
  setGameEntryMode: React.Dispatch<React.SetStateAction<GameEntryMode>>;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  gameKey: string;
  setGameKey: React.Dispatch<React.SetStateAction<string>>;
  hubAddress: string;
  setHubAddress: React.Dispatch<React.SetStateAction<string>>;
  clearValues: () => void;
}

const defaultContextValue: IGlobalGameContext = {
  gameEntryMode: GameEntryMode.Host,
  setGameEntryMode: () => {},
  gameType: GameType.Spin,
  setGameType: () => {},
  gameKey: "",
  setGameKey: () => {},
  hubAddress: "",
  setHubAddress: () => {},
  clearValues: () => {},
};

const GlobalGameContext = createContext<IGlobalGameContext>(defaultContextValue);

export const useGlobalGameProvider = () => useContext(GlobalGameContext);

interface GlobalGameProviderProps {
  children: ReactNode;
}

export const GlobalGameProvider = ({ children }: GlobalGameProviderProps) => {
  const [gameEntryMode, setGameEntryMode] = useState<GameEntryMode>(GameEntryMode.Host);
  const [gameType, setGameType] = useState<GameType>(GameType.Spin);
  const [gameKey, setGameKey] = useState<string>("");
  const [hubAddress, setHubAddress] = useState<string>("");

  const clearValues = () => {
    setGameEntryMode(GameEntryMode.Host);
    setGameType(GameType.Spin);
    setGameKey("");
    setHubAddress("");
  };

  const value = {
    clearValues,
    gameEntryMode,
    setGameEntryMode,
    gameType,
    setGameType,
    gameKey,
    setGameKey,
    hubAddress,
    setHubAddress,
  };

  return <GlobalGameContext.Provider value={value}>{children}</GlobalGameContext.Provider>;
};

export default GlobalGameProvider;
