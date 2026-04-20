import { registerCrashResetCallback } from "@/src/core/utils/navigationRef";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { BeerTrackerScreen } from "../constants/beerTrackerTypes";
import { useBeerTrackerScreenStore } from "./beerTrackerScreenStore";

interface IBeerTrackerContext {
  screen: BeerTrackerScreen;
  gameId: string | undefined;
  playerName: string | undefined;
  setScreen: (screen: BeerTrackerScreen) => void;
  setGameId: (id: string) => void;
  setPlayerName: (name: string) => void;
  clearBeerTrackerValues: () => void;
}

const defaultContextValue: IBeerTrackerContext = {
  screen: BeerTrackerScreen.Home,
  gameId: undefined,
  playerName: undefined,
  setScreen: () => {},
  setGameId: () => {},
  setPlayerName: () => {},
  clearBeerTrackerValues: () => {},
};

const BeerTrackerContext = createContext<IBeerTrackerContext>(defaultContextValue);

export const useBeerTrackerProvider = () => useContext(BeerTrackerContext);

interface BeerTrackerProviderProps {
  children: ReactNode;
}

export const BeerTrackerProvider = ({ children }: BeerTrackerProviderProps) => {
  useEffect(() => {
    return registerCrashResetCallback(clearBeerTrackerValues);
  }, []);

  const clearBeerTrackerValues = () => {
    useBeerTrackerScreenStore.getState().clearScreen();
  };

  const screen = useBeerTrackerScreenStore((state) => state.screen) ?? BeerTrackerScreen.Home;
  const gameId = useBeerTrackerScreenStore((state) => state.gameId);
  const playerName = useBeerTrackerScreenStore((state) => state.playerName);

  const setScreen = (value: BeerTrackerScreen) => {
    useBeerTrackerScreenStore.getState().setScreen(value);
  };

  const setGameId = (id: string) => {
    useBeerTrackerScreenStore.getState().setGameId(id);
  };

  const setPlayerName = (name: string) => {
    useBeerTrackerScreenStore.getState().setPlayerName(name);
  };

  const value: IBeerTrackerContext = {
    screen,
    gameId,
    playerName,
    setScreen,
    setGameId,
    setPlayerName,
    clearBeerTrackerValues,
  };

  return <BeerTrackerContext.Provider value={value}>{children}</BeerTrackerContext.Provider>;
};

export default BeerTrackerProvider;
