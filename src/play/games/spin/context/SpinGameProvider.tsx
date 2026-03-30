import Color from "@/src/core/constants/Color";
import { GameType } from "@/src/core/constants/Types";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { registerCrashResetCallback } from "@/src/core/utils/navigationRef";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SpinGameState, SpinSessionScreen } from "../constants/SpinTypes";
import { useSpinScreenStore } from "./spinScreenStore";

interface ISpinSessionContext {
  clearSpinSessionValues: () => void;
  screen: SpinSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<SpinSessionScreen>>;
  themeColor: string;
  secondaryThemeColor: string;
  featherIcon: "sword-cross" | "arrows-spin";
  setThemeColors: (gameType: GameType) => void;
  roundText: string;
  setRoundText: React.Dispatch<React.SetStateAction<string>>;
  selectedBatch: string[];
  setSelectedBatch: React.Dispatch<React.SetStateAction<string[]>>;
  gameState: SpinGameState;
  setGameState: React.Dispatch<React.SetStateAction<SpinGameState>>;
  iterations: number;
  setIterations: React.Dispatch<React.SetStateAction<number>>;
  players: number;
  setPlayers: React.Dispatch<React.SetStateAction<number>>;
}

const defaultContextValue: ISpinSessionContext = {
  clearSpinSessionValues: () => {},
  screen: SpinSessionScreen.Create,
  setScreen: () => {},
  themeColor: Color.BeigeLight,
  secondaryThemeColor: Color.Beige,
  featherIcon: "sword-cross",
  setThemeColors: () => {},
  roundText: "",
  setRoundText: () => {},
  selectedBatch: [],
  setSelectedBatch: () => {},
  gameState: SpinGameState.Initialized,
  setGameState: () => {},
  iterations: 0,
  setIterations: () => {},
  players: 0,
  setPlayers: () => {},
};

const SpinSessionContext = createContext<ISpinSessionContext>(defaultContextValue);

export const useSpinSessionProvider = () => useContext(SpinSessionContext);

interface SpinSessionProviderProps {
  children: ReactNode;
}

export const SpinSessionProvider = ({ children }: SpinSessionProviderProps) => {
  const { gameType } = useGlobalSessionProvider();
  const { getGameTheme } = useThemeProvider();
  const screen = useSpinScreenStore((state) => state.screen) || SpinSessionScreen.Create;
  const setScreen = (value: SpinSessionScreen | ((prev: SpinSessionScreen) => SpinSessionScreen)) => {
    const next = typeof value === "function" ? value(screen) : value;
    useSpinScreenStore.getState().setScreen(next);
  };
  const [themeColor, setThemeColor] = useState<string>(Color.BeigeLight);
  const [secondaryThemeColor, setSecondaryThemeColor] = useState<string>(Color.Beige);
  const [featherIcon, setFeatherIcon] = useState<"sword-cross" | "arrows-spin">("sword-cross");
  const [roundText, setRoundText] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string[]>([]);
  const [gameState, setGameState] = useState<SpinGameState>(SpinGameState.Initialized);
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);

  const setThemeColors = (gameType: GameType) => {
    const theme = getGameTheme(gameType);
    setThemeColor(theme.primaryColor);
    setSecondaryThemeColor(theme.secondaryColor);

    switch (gameType) {
      case GameType.Duel:
        setFeatherIcon("sword-cross");
        break;
      case GameType.Roulette:
        setFeatherIcon("arrows-spin");
        break;
      default:
        setFeatherIcon("sword-cross");
        break;
    }
  };

  const clearSpinSessionValues = () => {
    setIterations(0);
    setGameState(SpinGameState.Initialized);
    setPlayers(0);
    setSelectedBatch([]);
    setRoundText("");
    useSpinScreenStore.getState().clearScreen();
  };

  useEffect(() => {
    return registerCrashResetCallback(clearSpinSessionValues);
  }, []);

  const value = {
    clearSpinSessionValues,
    screen,
    setScreen,
    themeColor,
    secondaryThemeColor,
    featherIcon,
    setThemeColors,
    roundText,
    setRoundText,
    selectedBatch,
    setSelectedBatch,
    gameState,
    setGameState,
    iterations,
    setIterations,
    players,
    setPlayers,
  };

  return <SpinSessionContext.Provider value={value}>{children}</SpinSessionContext.Provider>;
};

export default SpinSessionProvider;
