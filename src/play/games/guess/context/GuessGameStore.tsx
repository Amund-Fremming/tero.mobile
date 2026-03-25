import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { GuessSessionScreen } from "../constants/GuessTypes";

interface GuessScreenState {
  screen: GuessSessionScreen | undefined;
  setScreen: (screen: GuessSessionScreen) => void;
  clearScreen: () => void;
}

export const useGuessScreenStore = create<GuessScreenState>()(
  persist(
    (set) => ({
      screen: undefined,
      setScreen: (screen) => set({ screen }),
      clearScreen: () => set({ screen: undefined }),
    }),
    {
      name: "spin-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
