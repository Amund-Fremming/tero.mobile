import { GameCategory } from "@/src/Common/constants/Types";

export const enum SpinSessionScreen {
  Lobby = "Lobby",
  Create = "Create",
  Game = "Game",
}

export interface CreateSpinGameRequest {
  userId: number;
  name: string;
  category?: GameCategory;
}

export enum SpinGameState {
  Initialized = "Initialized",
  RoundStarted = "RoundStarted",
  RoundInProgress = "RoundInProgress",
  RoundFinished = "RoundFinished",
  Finished = "Finished",
}
