import { useEffect } from "react";
import { useGlobalSessionProvider } from "../common/context/GlobalSessionProvider";
import { ImposterSessionScreen } from "./constants/imposterTypes";
import { GameEntryMode } from "../common/constants/Types";
import { useImposterSessionProvider } from "./context/ImposterSessionProvider";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";

export const ImposterGame = () => {
  const { gameEntryMode } = useGlobalSessionProvider();
  const { screen, setScreen } = useImposterSessionProvider();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
  }, []);

  const getInitialScreen = (): ImposterSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return ImposterSessionScreen.Create;
      case GameEntryMode.Host:
        return ImposterSessionScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return ImposterSessionScreen.Lobby;
      default:
        return ImposterSessionScreen.Lobby;
    }
  };

  switch (screen) {
    case ImposterSessionScreen.Create:
      return <CreateScreen />;
    case ImposterSessionScreen.Game:
      return <GameScreen />;
    case ImposterSessionScreen.Lobby:
      return <ActiveLobbyScreen />;
    default:
      return <ActiveLobbyScreen />;
  }
};

export default ImposterGame;
