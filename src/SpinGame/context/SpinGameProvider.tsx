import React, { createContext, ReactNode, useContext, useState } from "react";
import { SpinSessionScreen } from "../constants/SpinTypes";

interface ISpinSessionContext {
  clearSpinSessionValues: () => void;
  screen: SpinSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<SpinSessionScreen>>;
}

const defaultContextValue: ISpinSessionContext = {
  clearSpinSessionValues: () => {},
  screen: SpinSessionScreen.Create,
  setScreen: () => {},
};

const SpinGameContext = createContext<ISpinSessionContext>(defaultContextValue);

export const useSpinGameProvider = () => useContext(SpinGameContext);

interface SpinGameProviderProps {
  children: ReactNode;
}

export const SpinGameProvider = ({ children }: SpinGameProviderProps) => {
  const [screen, setScreen] = useState<SpinSessionScreen>(SpinSessionScreen.Create);

  const clearSpinSessionValues = () => {
    setScreen(SpinSessionScreen.Create);
  };

  const value = {
    clearSpinSessionValues,
    screen,
    setScreen,
  };

  return <SpinGameContext.Provider value={value}>{children}</SpinGameContext.Provider>;
};

export default SpinGameProvider;
