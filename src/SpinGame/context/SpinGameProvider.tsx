import React, { createContext, ReactNode, useContext, useState } from "react";
import SpinSession, { SpinSessionScreen } from "../constants/SpinTypes";

interface ISpinSessionContext {
  clearSpinSessionValues: () => void;
  spinSession: SpinSession | undefined;
  setSpinSession: React.Dispatch<React.SetStateAction<SpinSession | undefined>>;
  screen: SpinSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<SpinSessionScreen>>;
}

const defaultContextValue: ISpinSessionContext = {
  clearSpinSessionValues: () => {},
  spinSession: undefined,
  setSpinSession: () => {},
  screen: SpinSessionScreen.Create,
  setScreen: () => {},
};

const SpinGameContext = createContext<ISpinSessionContext>(defaultContextValue);

export const useSpinGameProvider = () => useContext(SpinGameContext);

interface SpinGameProviderProps {
  children: ReactNode;
}

export const SpinGameProvider = ({ children }: SpinGameProviderProps) => {
  const [spinSession, setSpinSession] = useState<SpinSession | undefined>(undefined);
  const [screen, setScreen] = useState<SpinSessionScreen>(SpinSessionScreen.Create);

  const clearSpinSessionValues = () => {
    setSpinSession(undefined);
  };

  const value = {
    clearSpinSessionValues,
    spinSession,
    setSpinSession,
    screen,
    setScreen,
  };

  return <SpinGameContext.Provider value={value}>{children}</SpinGameContext.Provider>;
};

export default SpinGameProvider;
