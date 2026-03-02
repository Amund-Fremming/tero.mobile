import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameScreenState {
  screens: Record<string, string>;
  setScreen: (gameKey: string, screen: string) => void;
  clearScreen: (gameKey: string) => void;
  clearAllScreens: () => void;
}

export const useGameScreenStore = create<GameScreenState>()(
  persist(
    (set) => ({
      screens: {},
      setScreen: (gameKey, screen) => set((state) => ({ screens: { ...state.screens, [gameKey]: screen } })),
      clearScreen: (gameKey) =>
        set((state) => {
          const { [gameKey]: _, ...rest } = state.screens;
          return { screens: rest };
        }),
      clearAllScreens: () => set({ screens: {} }),
    }),
    {
      name: "game-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
