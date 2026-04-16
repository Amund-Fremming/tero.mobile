import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BeerTrackerScreen } from "../constants/beerTrackerTypes";

interface BeerTrackerScreenState {
  screen: BeerTrackerScreen | undefined;
  setScreen: (screen: BeerTrackerScreen) => void;
  clearScreen: () => void;
}

export const useBeerTrackerScreenStore = create<BeerTrackerScreenState>()(
  persist(
    (set) => ({
      screen: undefined,
      setScreen: (screen) => set({ screen }),
      clearScreen: () => set({ screen: undefined }),
    }),
    {
      name: "beer-tracker-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
