import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImposterSession, ImposterSessionScreen } from "../constants/imposterTypes";

interface IImposterSessionContext {
  clearImposterSessionValues: () => void;
  screen: ImposterSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<ImposterSessionScreen>>;
  iterations: number;
  setIterations: React.Dispatch<React.SetStateAction<number>>;
  session: ImposterSession | undefined;
  setSession: React.Dispatch<React.SetStateAction<ImposterSession | undefined>>;
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

const defaultContextValue: IImposterSessionContext = {
  clearImposterSessionValues: () => {},
  screen: ImposterSessionScreen.Create,
  setScreen: () => {},
  iterations: 0,
  setIterations: () => {},
  session: undefined,
  setSession: () => {},
  players: ["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"],
  setPlayers: () => {},
};

const ImposterSessionContext = createContext<IImposterSessionContext>(defaultContextValue);

export const useImposterSessionProvider = () => useContext(ImposterSessionContext);

interface SpinGameProviderProps {
  children: ReactNode;
}

export const ImposterSessionProvider = ({ children }: SpinGameProviderProps) => {
  const [screen, setScreen] = useState<ImposterSessionScreen>(ImposterSessionScreen.Create);
  const [iterations, setIterations] = useState<number>(0);
  const [session, setSession] = useState<ImposterSession | undefined>(undefined);
  const [players, setPlayers] = useState<string[]>(["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"]);

  const clearImposterSessionValues = () => {
    setScreen(ImposterSessionScreen.Create);
    setIterations(0);
    setPlayers(["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"]);
  };

  const value = {
    clearImposterSessionValues,
    screen,
    setScreen,
    iterations,
    setIterations,
    session,
    setSession,
    players,
    setPlayers,
  };

  return <ImposterSessionContext.Provider value={value}>{children}</ImposterSessionContext.Provider>;
};

export default ImposterSessionProvider;
