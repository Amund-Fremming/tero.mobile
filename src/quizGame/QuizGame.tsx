import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { GameEntryMode } from "../common/constants/Types";
import { useEffect } from "react";
import { QuizGameScreen } from "./constants/quizTypes";
import { CreateScreen } from "./screens/CreateScreen/CreateScreen";
import { useQuizSessionProvider } from "./context/QuizGameProvider";

export const QuizGame = () => {
  const { gameEntryMode } = useGlobalSessionProvider();
  const { screen, setScreen } = useQuizSessionProvider();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
  }, []);

  const getInitialScreen = (): QuizGameScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return QuizGameScreen.Create;
      case GameEntryMode.Host:
        return QuizGameScreen.Game;
      case GameEntryMode.Participant:
      case GameEntryMode.Member:
        return QuizGameScreen.Lobby;
      default:
        return QuizGameScreen.Lobby;
    }
  };

  switch (screen) {
    case QuizGameScreen.Create:
      return <CreateScreen />;
    case QuizGameScreen.Game:
      return <GameScreen />;
    case QuizGameScreen.Lobby:
      return <LobbyScreen />;
    case QuizGameScreen.Started:
      return <StartedScreen />;
    default:
      return <LobbyScreen />;
  }
};

export default QuizGame;
