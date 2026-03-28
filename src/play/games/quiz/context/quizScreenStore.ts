import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { QuizGameScreen } from "../constants/quizTypes";

interface QuizScreenState {
  screen: QuizGameScreen | undefined;
  setScreen: (screen: QuizGameScreen) => void;
  clearScreen: () => void;
}

export const useQuizScreenStore = create<QuizScreenState>()(
  persist(
    (set) => ({
      screen: undefined,
      setScreen: (screen) => set({ screen }),
      clearScreen: () => set({ screen: undefined }),
    }),
    {
      name: "quiz-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
