import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GameEntryMode, GameType } from "../../core/constants/Types";

interface IGlobalSessionContext {
  gameEntryMode: GameEntryMode;
  setGameEntryMode: React.Dispatch<React.SetStateAction<GameEntryMode>>;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  gameKey: string;
  setGameKey: React.Dispatch<React.SetStateAction<string>>;
  hubAddress: string;
  setHubAddress: React.Dispatch<React.SetStateAction<string>>;
  isHost: boolean;
  setIsHost: React.Dispatch<React.SetStateAction<boolean>>;
  clearGlobalSessionValues: () => void;
  isDraft: boolean;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: IGlobalSessionContext = {
  gameEntryMode: GameEntryMode.Creator,
  setGameEntryMode: () => {},
  gameType: GameType.Quiz,
  setGameType: () => {},
  gameKey: "",
  setGameKey: () => {},
  hubAddress: "",
  setHubAddress: () => {},
  isHost: false,
  setIsHost: () => {},
  isDraft: false,
  setIsDraft: () => {},
  clearGlobalSessionValues: () => {},
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
  const [hubAddress, setHubAddress] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  useEffect(() => {}, [isHost]);

  const clearGlobalSessionValues = () => {
    setGameEntryMode(GameEntryMode.Creator);
    setGameType(GameType.Quiz);
    setGameKey("");
    setHubAddress("");
    setIsHost(false);
  };

  const value = {
    clearGlobalSessionValues,
    gameEntryMode,
    setGameEntryMode,
    gameType,
    setGameType,
    gameKey,
    setGameKey,
    hubAddress,
    setHubAddress,
    isHost,
    setIsHost,
    isDraft,
    setIsDraft,
  };

  return <GlobalSessionContext.Provider value={value}>{children}</GlobalSessionContext.Provider>;
};

export default GlobalGameProvider;
