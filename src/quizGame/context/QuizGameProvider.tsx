import React, { createContext, ReactNode, useContext, useState } from "react";
import { QuizGameScreen as QuizSessionScreen, QuizSession } from "../constants/quizTypes";

interface IQuizGameContext {
  clearQuizGameValues: () => void;
  quizSession: QuizSession | undefined;
  setQuizSession: React.Dispatch<React.SetStateAction<QuizSession | undefined>>;
  screen: QuizSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<QuizSessionScreen>>;
}

const defaultContextValue: IQuizGameContext = {
  clearQuizGameValues: () => {},
  quizSession: undefined,
  setQuizSession: () => {},
  screen: QuizSessionScreen.Create,
  setScreen: () => {},
};

const QuizGameContext = createContext<IQuizGameContext>(defaultContextValue);

export const useQuizGameProvider = () => useContext(QuizGameContext);

interface QuizGameProviderProps {
  children: ReactNode;
}

export const QuizSessionProvider = ({ children }: QuizGameProviderProps) => {
  const [quizSession, setQuizSession] = useState<QuizSession | undefined>(undefined);
  const [screen, setScreen] = useState<QuizSessionScreen>(QuizSessionScreen.Create);

  const clearQuizSessionValues = () => {
    setQuizSession(undefined);
  };

  const value = {
    clearQuizGameValues: clearQuizSessionValues,
    quizSession,
    setQuizSession,
    screen,
    setScreen,
  };

  return <QuizGameContext.Provider value={value}>{children}</QuizGameContext.Provider>;
};

export default QuizSessionProvider;
