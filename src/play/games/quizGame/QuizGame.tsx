import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { useEffect } from "react";
import { QuizGameScreen, QuizSession } from "./constants/quizTypes";
import { CreateScreen } from "./screens/CreateScreen/CreateScreen";
import { useQuizSessionProvider } from "./context/QuizGameProvider";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { HubChannel } from "@/src/core/constants/HubChannel";
import { useNavigation } from "expo-router";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";

export const QuizGame = () => {
  const navigation: any = useNavigation();
  const { gameEntryMode, gameKey, hubName, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { screen, setScreen, setQuizSession, setIterations, clearQuizGameValues } = useQuizSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
  }, []);

  useEffect(() => {
    if (!gameKey) return;
    if (gameEntryMode === GameEntryMode.Host) return;

    initializeHub(gameKey, hubName);

    return () => {
      disconnect();
    };
  }, [gameKey]);

  const initializeHub = async (key: string, hub: string) => {
    const result = await connect(hub);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    setupListeners();

    const connectResult = await invokeFunction("ConnectToGroup", key);
    if (connectResult.isError()) {
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt");
      await disconnect();
      return;
    }
  };

  const setupListeners = () => {
    setListener(HubChannel.Iterations, (count: number) => {
      setIterations(count);
    });

    setListener(HubChannel.Error, (message: string) => {
      disconnect();
      clearQuizGameValues();
      clearGlobalSessionValues();
      displayErrorModal(message, () => resetToHomeScreen(navigation));
    });

    setListener(HubChannel.Game, (game: QuizSession) => {
      setQuizSession(game);
    });

    setListener(HubChannel.State, (_message: string) => {
      setScreen(QuizGameScreen.Started);
      disconnect();
    });
  };

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
