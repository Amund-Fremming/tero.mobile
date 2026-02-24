export const enum ImposterSessionScreen {
  ActiveLobby = "ActiveLobby",
  Create = "Create",
  Game = "Game",
  Started = "Started",
  AddPlayers = "Players",
}

export interface ImposterSession {
  gameId: string;
  hostId: string;
  currentIteration: number;
  rounds: Array<string>;
  players: Set<string>;
}
