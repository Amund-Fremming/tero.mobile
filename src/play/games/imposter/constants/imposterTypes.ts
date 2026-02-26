export const enum ImposterSessionScreen {
  ActiveLobby = "ActiveLobby",
  Create = "Create",
  Roles = "Roles",
  Reveal = "Reveal",
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
