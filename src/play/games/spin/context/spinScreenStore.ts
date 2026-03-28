import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SpinSessionScreen } from "../constants/SpinTypes";

interface SpinScreenState {
  screen: SpinSessionScreen | undefined;
  setScreen: (screen: SpinSessionScreen) => void;
  clearScreen: () => void;
}

export const useSpinScreenStore = create<SpinScreenState>()(
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
