import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ImposterSessionScreen } from "../constants/imposterTypes";

interface ImposterScreenState {
  screen: ImposterSessionScreen | undefined;
  setScreen: (screen: ImposterSessionScreen) => void;
  clearScreen: () => void;
}

export const useImposterScreenStore = create<ImposterScreenState>()(
  persist(
    (set) => ({
      screen: undefined,
      setScreen: (screen) => set({ screen }),
      clearScreen: () => set({ screen: undefined }),
    }),
    {
      name: "imposter-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
