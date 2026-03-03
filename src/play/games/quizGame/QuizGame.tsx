import { HubChannel } from "@/src/core/constants/HubChannel";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { QuizGameScreen, QuizSession } from "./constants/quizTypes";
import { useQuizSessionProvider } from "./context/QuizGameProvider";
import { CreateScreen } from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";

export const QuizGame = () => {
  const outerNavigation: any = useNavigation();
  const { gameEntryMode, gameKey, hubName, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setQuizSession, setIterations, clearQuizGameValues, screen, setScreen } = useQuizSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();

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

  useEffect(() => {
    setScreen(getInitialScreen());

    return () => {
      clearQuizGameValues();
      clearGlobalSessionValues();
    };
  }, []);

  useEffect(() => {
    if (!gameKey) {
      // TODO - return to home?
      return;
    }


    if (gameEntryMode === GameEntryMode.Host) {
      return;
    }

    initializeHub(gameKey, hubName);
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
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt", () => {
        clearGlobalSessionValues();
        clearQuizGameValues();
        disconnect();
        resetToHomeScreen(outerNavigation);
      });
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
      displayErrorModal(message, () => resetToHomeScreen(outerNavigation));
    });

    setListener(HubChannel.Game, (game: QuizSession) => {
      setQuizSession(game);
    });

    setListener(HubChannel.State, async (_message: string) => {
      await disconnect();
      setScreen(QuizGameScreen.Started);
    });
  };

  switch (screen) {
    case QuizGameScreen.Create:
      return <CreateScreen />;
    case QuizGameScreen.Game:
      return <GameScreen />;
    case QuizGameScreen.Started:
      return <StartedScreen />;
    case QuizGameScreen.Lobby:
    default:
      return <LobbyScreen />;
  }
};

export default QuizGame;
