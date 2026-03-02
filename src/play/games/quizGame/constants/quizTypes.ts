export enum QuizGameScreen {
  Create = "Create",
  Game = "Game",
  Lobby = "Lobby",
  Started = "Started",
}

export interface QuizSession {
  game_id: string;
  current_iteration: number;
  rounds: string[];
}
