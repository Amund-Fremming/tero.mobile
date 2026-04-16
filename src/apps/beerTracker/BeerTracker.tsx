import { BeerTrackerScreen } from "./constants/beerTrackerTypes";
import { useBeerTrackerProvider } from "./context/BeerTrackerProvider";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";

export const BeerTracker = () => {
  const { screen } = useBeerTrackerProvider();

  switch (screen) {
    case BeerTrackerScreen.Home:
      return <HomeScreen />;
  }
};

export default BeerTracker;
