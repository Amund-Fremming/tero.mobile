export enum QuizGameScreen {
  Tutorial = "Tutorial",
  Game = "Game",
  Lobby = "Lobby",
  Started = "Started",
  Create = "Create",
}

export interface QuizSession {
  game_id: string;
  current_iteration: number;
  rounds: string[];
}
