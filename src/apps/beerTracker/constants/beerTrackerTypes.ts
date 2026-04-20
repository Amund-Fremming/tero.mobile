export enum BeerTrackerScreen {
  Home = "Home",
  Join = "Join",
  Game = "Game",
}

export interface BeerTrackerGame {
  id: string;
  can_size: number;
  goal: number | null;
  members: UserScore[];
}

export interface UserScore {
  name: string;
  count: number;
}
