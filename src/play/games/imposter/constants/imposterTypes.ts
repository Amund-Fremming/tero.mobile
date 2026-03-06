export const enum ImposterSessionScreen {
  ActiveLobby = "ActiveLobby",
  Tutorial = "Tutorial",
  Create = "Create",
  Roles = "Roles",
  RoundInstructions = "RoundInstructions",
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
