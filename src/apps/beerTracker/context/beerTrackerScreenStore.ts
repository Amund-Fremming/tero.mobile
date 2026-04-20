import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BeerTrackerScreen } from "../constants/beerTrackerTypes";

interface BeerTrackerScreenState {
  screen: BeerTrackerScreen | undefined;
  gameId: string | undefined;
  playerName: string | undefined;
  setScreen: (screen: BeerTrackerScreen) => void;
  setGameId: (id: string) => void;
  setPlayerName: (name: string) => void;
  clearScreen: () => void;
}

export const useBeerTrackerScreenStore = create<BeerTrackerScreenState>()(
  persist(
    (set) => ({
      screen: undefined,
      gameId: undefined,
      playerName: undefined,
      setScreen: (screen) => set({ screen }),
      setGameId: (gameId) => set({ gameId }),
      setPlayerName: (playerName) => set({ playerName }),
      clearScreen: () => set({ screen: undefined, gameId: undefined, playerName: undefined }),
    }),
    {
      name: "beer-tracker-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
