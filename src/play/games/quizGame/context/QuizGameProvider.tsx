import React, { createContext, ReactNode, useContext, useState } from "react";
import { QuizGameScreen as QuizSessionScreen, QuizSession } from "../constants/quizTypes";

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

// Module-level cache survives Fast Refresh / hot reload
let __screenCache: QuizSessionScreen | null = null;
export const getQuizScreenCache = () => __screenCache;

export const QuizSessionProvider = ({ children }: QuizSessionProviderProps) => {
  const [quizSession, setQuizSession] = useState<QuizSession | undefined>(undefined);
  const [screen, _setScreen] = useState<QuizSessionScreen>(__screenCache ?? QuizSessionScreen.Create);
  const setScreen: React.Dispatch<React.SetStateAction<QuizSessionScreen>> = (value) => {
    const next = typeof value === "function" ? value(screen) : value;
    __screenCache = next;
    _setScreen(next);
  };
  const [iterations, setIterations] = useState<number>(0);

  const clearQuizSessionValues = () => {
    __screenCache = null;
    setQuizSession(undefined);
    setScreen(QuizSessionScreen.Create);
    setIterations(0);
  };

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
