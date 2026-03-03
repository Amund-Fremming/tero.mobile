import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameScreenState {
  screen: string | undefined;
  setScreen: (screen: string) => void;
  clearScreen: () => void;
}

export const useGameScreenStore = create<GameScreenState>()(
  persist(
    (set) => ({
      screen: undefined,
      setScreen: (screen) => set({ screen }),
      clearScreen: () => set({ screen: undefined }),
    }),
    {
      name: "game-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
