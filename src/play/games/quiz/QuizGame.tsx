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
import TutorialScreen from "./screens/TutorialScreen/TutorialScreen";

export const QuizGame = () => {
  const outerNavigation: any = useNavigation();
  const { gameEntryMode, sessionData: sessionData, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setQuizSession, setIterations, clearQuizGameValues, screen, setScreen } = useQuizSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayActionModal } = useModalProvider();

  useEffect(() => {
    setScreen(QuizGameScreen.Tutorial);

    return () => {
      clearQuizGameValues();
      clearGlobalSessionValues();
    };
  }, []);

  useEffect(() => {
    if (!sessionData.gameKey) {
      if (gameEntryMode !== GameEntryMode.Creator) {
        resetToHomeScreen(outerNavigation);
      }
      return;
    }

    if (gameEntryMode === GameEntryMode.Host) {
      return;
    }

    initializeHub(sessionData.gameKey, sessionData.hubName);
  }, [sessionData.gameKey, sessionData.hubName]);

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

  const handleLeavePressed = () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      () => {
        disconnect();
        clearQuizGameValues();
        clearGlobalSessionValues();
        resetToHomeScreen(outerNavigation);
      },
      () => {},
    );
  };

  switch (screen) {
    case QuizGameScreen.Tutorial:
      return <TutorialScreen />;
    case QuizGameScreen.Game:
      return <GameScreen onLeave={handleLeavePressed} />;
    case QuizGameScreen.Started:
      return <StartedScreen />;
    case QuizGameScreen.Lobby:
      return <LobbyScreen onLeave={handleLeavePressed} />;
    case QuizGameScreen.Create:
      return <CreateScreen />;
    default:
      return <LobbyScreen onLeave={handleLeavePressed} />;
  }
};

export default QuizGame;
