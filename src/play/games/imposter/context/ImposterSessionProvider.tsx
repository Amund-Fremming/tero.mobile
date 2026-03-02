import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { ImposterSession, ImposterSessionScreen } from "../constants/imposterTypes";
import { registerCrashResetCallback } from "@/src/core/utils/navigationRef";
import { useGameScreenStore } from "@/src/play/stores/gameScreenStore";

const GAME_KEY = "imposter";

interface IImposterSessionContext {
  clearImposterSessionValues: () => void;
  screen: ImposterSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<ImposterSessionScreen>>;
  iterations: number;
  setIterations: React.Dispatch<React.SetStateAction<number>>;
  imposterSession: ImposterSession | undefined;
  setImposterSession: React.Dispatch<React.SetStateAction<ImposterSession | undefined>>;
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
  imposterSession: undefined,
  setImposterSession: () => {},
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
  const persistedScreen = useGameScreenStore((s) => s.screens[GAME_KEY]) as ImposterSessionScreen | undefined;
  const screen = persistedScreen ?? ImposterSessionScreen.Create;
  const setScreen = (value: ImposterSessionScreen | ((prev: ImposterSessionScreen) => ImposterSessionScreen)) => {
    const next = typeof value === "function" ? value(screen) : value;
    useGameScreenStore.getState().setScreen(GAME_KEY, next);
  };
  const [iterations, setIterations] = useState<number>(0);
  const [imposterSession, setImposterSession] = useState<ImposterSession | undefined>(undefined);
  const [players, setPlayers] = useState<string[]>(["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"]);
  const [imposterName, setImposterName] = useState<string>("");
  const [roundWord, setRoundWord] = useState<string>("");

  const newRound = () => {
    if (!imposterSession || !imposterSession.players || !imposterSession.rounds || imposterSession.rounds.length === 0)
      return;
    const playersArray = Array.from(imposterSession.players);
    const randomPlayerIndex = Math.floor(Math.random() * playersArray.length);
    setImposterName(playersArray[randomPlayerIndex]);
    const randomRoundIndex = Math.floor(Math.random() * imposterSession.rounds.length);
    const picked = imposterSession.rounds[randomRoundIndex];
    setRoundWord(picked);
    setImposterSession({
      ...imposterSession,
      currentIteration: imposterSession.currentIteration + 1,
      rounds: imposterSession.rounds.filter((_, i) => i !== randomRoundIndex),
    });
  };

  const clearImposterSessionValues = () => {
    useGameScreenStore.getState().clearScreen(GAME_KEY);
    setIterations(0);
    setPlayers(["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"]);
    setImposterName("");
    setRoundWord("");
  };

  useEffect(() => {
    return registerCrashResetCallback(clearImposterSessionValues);
  }, []);

  const value = {
    clearImposterSessionValues,
    screen,
    setScreen,
    iterations,
    setIterations,
    imposterSession,
    setImposterSession,
    players,
    setPlayers,
    imposterName,
    newRound,
    roundWord,
  };

  return <ImposterSessionContext.Provider value={value}>{children}</ImposterSessionContext.Provider>;
};

export default ImposterSessionProvider;
