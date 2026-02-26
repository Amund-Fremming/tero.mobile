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
  imposterName: string;
  newRound: () => void;
  roundWord: string;
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
  imposterName: "",
  newRound: () => {},
  roundWord: "",
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
  const [imposterName, setImposterName] = useState<string>("");
  const [roundWord, setRoundWord] = useState<string>("");

  const newRound = () => {
    if (!session || !session.players || !session.rounds || session.rounds.length === 0) return;
    const playersArray = Array.from(session.players);
    const randomPlayerIndex = Math.floor(Math.random() * playersArray.length);
    setImposterName(playersArray[randomPlayerIndex]);
    const randomRoundIndex = Math.floor(Math.random() * session.rounds.length);
    const picked = session.rounds[randomRoundIndex];
    setRoundWord(picked);
    setSession({
      ...session,
      currentIteration: session.currentIteration + 1,
      rounds: session.rounds.filter((_, i) => i !== randomRoundIndex),
    });
  };

  const clearImposterSessionValues = () => {
    setScreen(ImposterSessionScreen.Create);
    setIterations(0);
    setPlayers(["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"]);
    setImposterName("");
    setRoundWord("");
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
    imposterName,
    newRound,
    roundWord,
  };

  return <ImposterSessionContext.Provider value={value}>{children}</ImposterSessionContext.Provider>;
};

export default ImposterSessionProvider;
