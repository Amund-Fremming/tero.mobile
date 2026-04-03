import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Color from "../constants/Color";
import { GameType } from "../constants/Types";

export interface GameTheme {
  primaryColor: string;
  secondaryColor: string;
}

export const gameThemeMap: Record<GameType, GameTheme> = {
  [GameType.Quiz]: {
    primaryColor: Color.LighterGreen,
    secondaryColor: Color.DeepForest,
  },
  [GameType.Roulette]: {
    primaryColor: Color.SkyBlue,
    secondaryColor: Color.SkyBlueLight,
  },
  [GameType.Duel]: {
    primaryColor: Color.Beige,
    secondaryColor: Color.BeigeLight,
  },
  [GameType.Imposter]: {
    primaryColor: Color.ImposterPrimary,
    secondaryColor: Color.ImposterSecondary,
  },
  [GameType.Dice]: {
    primaryColor: Color.LightGray,
    secondaryColor: Color.OffBlack,
  },
  [GameType.Guess]: {
    primaryColor: Color.GuessPrimary,
    secondaryColor: Color.GuessSecondary,
  },
  [GameType.Defuser]: {
    primaryColor: Color.Black, // bomb body
    secondaryColor: Color.Red, // danger/explosion
    // Optionally, add accent: Color.Yellow or Color.Blue for wires
  },
};

const defaultGameTheme: GameTheme = {
  primaryColor: Color.LighterGreen,
  secondaryColor: Color.DeepForest,
};

export interface AppTheme {
  primary: string;
  secondary: string;
  cardBorder: string;
}

const lightTheme: AppTheme = {
  primary: Color.White,
  secondary: Color.LightGray,
  cardBorder: Color.Gray,
};

const darkTheme: AppTheme = {
  primary: Color.Black,
  secondary: Color.OffBlack,
  cardBorder: Color.OffBlack,
};

interface ThemeStore {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      setDarkMode: (value) => set({ darkMode: value }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

interface IThemeContext {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  getGameTheme: (game: GameType) => GameTheme;
  theme: AppTheme;
}

const defaultContextValue: IThemeContext = {
  darkMode: true,
  setDarkMode: (value: boolean) => false,
  getGameTheme: (game: GameType) => gameThemeMap[game] ?? defaultGameTheme,
  theme: darkTheme,
};

const ThemeContext = createContext<IThemeContext>(defaultContextValue);

export const useThemeProvider = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { darkMode, setDarkMode } = useThemeStore();

  const getGameTheme = (game: GameType): GameTheme => {
    return gameThemeMap[game] ?? defaultGameTheme;
  };

  const theme = darkMode ? darkTheme : lightTheme;

  const value: IThemeContext = {
    setDarkMode,
    darkMode,
    getGameTheme,
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
