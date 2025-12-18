import { BaseUser, GameBase, GameCategory } from "@/src/Common/constants/Types";

export const enum SpinSessionScreen {
  Lobby = "Lobby",
  Started = "Started",
  Finished = "Finished",
  Create = "Create",
  Choose = "Choose",
  Game = "Game",
}

export interface SpinSession extends GameBase {
  category: GameCategory;
  state: SpinGameState;
  hubGroupName: string;
  hostId: number;
  Host: BaseUser | undefined;
  players: SpinPlayer[];
  challenges: Challenge[];
}

export interface SpinPlayer {
  id: number;
  gameId: number;
  userId: number;
  active: boolean;
  spinGame: SpinSession;
  user: BaseUser;
}

export interface Challenge {
  id: number;
  gameId: number;
  participants: number;
  text: string;
  readBeforeSpin: boolean;
}

export interface CreateSpinGameRequest {
  userId: number;
  name: string;
  category?: GameCategory;
}

export enum SpinGameState {
  Initialized,
  ChallengesClosed,
  RoundStarted,
  Spinning,
  RoundFinished,
  Finished,
}

export default SpinSession;
