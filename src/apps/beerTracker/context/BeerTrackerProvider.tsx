import { registerCrashResetCallback } from "@/src/core/utils/navigationRef";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { BeerTrackerScreen } from "../constants/beerTrackerTypes";
import { useBeerTrackerScreenStore } from "./beerTrackerScreenStore";

interface IBeerTrackerContext {
  screen: BeerTrackerScreen;
  setScreen: (screen: BeerTrackerScreen) => void;
  clearBeerTrackerValues: () => void;
}

const defaultContextValue: IBeerTrackerContext = {
  screen: BeerTrackerScreen.Home,
  setScreen: () => {},
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

  const setScreen = (value: BeerTrackerScreen) => {
    useBeerTrackerScreenStore.getState().setScreen(value);
  };

  const value: IBeerTrackerContext = {
    screen,
    setScreen,
    clearBeerTrackerValues,
  };

  return <BeerTrackerContext.Provider value={value}>{children}</BeerTrackerContext.Provider>;
};

export default BeerTrackerProvider;
