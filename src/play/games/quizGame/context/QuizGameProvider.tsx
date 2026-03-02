import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { QuizGameScreen as QuizSessionScreen, QuizSession } from "../constants/quizTypes";
import { registerCrashResetCallback } from "@/src/core/utils/navigationRef";
import { useGameScreenStore } from "@/src/play/stores/gameScreenStore";

const GAME_KEY = "quiz";

interface IQuizSessionContext {
  clearQuizGameValues: () => void;
  quizSession: QuizSession | undefined;
  setQuizSession: React.Dispatch<React.SetStateAction<QuizSession | undefined>>;
  screen: QuizSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<QuizSessionScreen>>;
  iterations: number;
  setIterations: React.Dispatch<React.SetStateAction<number>>;
}

const defaultContextValue: IQuizSessionContext = {
  clearQuizGameValues: () => {},
  quizSession: undefined,
  setQuizSession: () => {},
  screen: QuizSessionScreen.Create,
  setScreen: () => {},
  iterations: 0,
  setIterations: () => {},
};

const QuizSessionContext = createContext<IQuizSessionContext>(defaultContextValue);

export const useQuizSessionProvider = () => useContext(QuizSessionContext);

interface QuizSessionProviderProps {
  children: ReactNode;
}

export const QuizSessionProvider = ({ children }: QuizSessionProviderProps) => {
  const [quizSession, setQuizSession] = useState<QuizSession | undefined>(undefined);
  const persistedScreen = useGameScreenStore((s) => s.screens[GAME_KEY]) as QuizSessionScreen | undefined;
  const screen = persistedScreen ?? QuizSessionScreen.Create;
  const setScreen = (value: QuizSessionScreen | ((prev: QuizSessionScreen) => QuizSessionScreen)) => {
    const next = typeof value === "function" ? value(screen) : value;
    useGameScreenStore.getState().setScreen(GAME_KEY, next);
  };
  const [iterations, setIterations] = useState<number>(0);

  const clearQuizSessionValues = () => {
    useGameScreenStore.getState().clearScreen(GAME_KEY);
    setQuizSession(undefined);
    setIterations(0);
  };

  useEffect(() => {
    return registerCrashResetCallback(clearQuizSessionValues);
  }, []);

  const value = {
    clearQuizGameValues: clearQuizSessionValues,
    quizSession,
    setQuizSession,
    screen,
    setScreen,
    iterations,
    setIterations,
  };

  return <QuizSessionContext.Provider value={value}>{children}</QuizSessionContext.Provider>;
};

export default QuizSessionProvider;
