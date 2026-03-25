import { registerCrashResetCallback } from "@/src/core/utils/navigationRef";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GuessSessionScreen } from "../constants/GuessTypes";
import { useGuessScreenStore } from "./GuessGameStore";

interface IGuessSessionContext {
  clearGuessSessionValues: () => void;
  screen: GuessSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<GuessSessionScreen>>;
  iterations: number;
  setIterations: React.Dispatch<React.SetStateAction<number>>;
  players: number;
  setPlayers: React.Dispatch<React.SetStateAction<number>>;
}

const defaultContextValue: IGuessSessionContext = {
  clearGuessSessionValues: () => {},
  screen: GuessSessionScreen.Create,
  setScreen: () => {},
  iterations: 0,
  setIterations: () => {},
  players: 0,
  setPlayers: () => {},
};

const GuessSessionContext = createContext<IGuessSessionContext>(defaultContextValue);

export const useGuessSessionProvider = () => useContext(GuessSessionContext);

interface GuessSessionProviderProps {
  children: ReactNode;
}

export const GuessSessionProvider = ({ children }: GuessSessionProviderProps) => {
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);

  useEffect(() => {
    return registerCrashResetCallback(clearGuessSessionValues);
  }, []);

  const clearGuessSessionValues = () => {
    setIterations(0);
    setPlayers(0);
    useGuessScreenStore.getState().clearScreen();
  };

  const screen = useGuessScreenStore((state) => state.screen) || GuessSessionScreen.Create;

  const setScreen = (value: GuessSessionScreen | ((prev: GuessSessionScreen) => GuessSessionScreen)) => {
    const next = typeof value === "function" ? value(screen) : value;
    useGuessScreenStore.getState().setScreen(next);
  };

  const value = {
    clearGuessSessionValues,
    screen,
    setScreen,
    iterations,
    setIterations,
    players,
    setPlayers,
  };

  return <GuessSessionContext.Provider value={value}>{children}</GuessSessionContext.Provider>;
};

export default GuessSessionProvider;
