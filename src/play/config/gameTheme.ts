import Color from "@/src/core/constants/Color";
import { GameType } from "@/src/core/constants/Types";

export interface GameTheme {
  primaryColor: string;
  secondaryColor: string;
}

const defaultGameTheme: GameTheme = {
  primaryColor: Color.LighterGreen,
  secondaryColor: Color.DeepForest,
};

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
    primaryColor: Color.LightGray,
    secondaryColor: Color.OffBlack,
  },
};

export const getGameTheme = (gameType: GameType): GameTheme => {
  return gameThemeMap[gameType] ?? defaultGameTheme;
};
