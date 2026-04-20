import { BeerTrackerScreen } from "./constants/beerTrackerTypes";
import { useBeerTrackerProvider } from "./context/BeerTrackerProvider";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { JoinScreen } from "./screens/JoinScreen/JoinScreen";

export const BeerTracker = () => {
  const { screen } = useBeerTrackerProvider();

  switch (screen) {
    case BeerTrackerScreen.Home:
      return <HomeScreen />;
    case BeerTrackerScreen.Join:
      return <JoinScreen />;
    case BeerTrackerScreen.Game:
      return <GameScreen />;
  }
};

export default BeerTracker;
