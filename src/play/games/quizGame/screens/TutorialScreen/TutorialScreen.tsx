import { GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { QuizGameScreen } from "../../constants/quizTypes";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const TutorialScreen = () => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const {
    setSessionDataValues: setGameSessionValues,
    setGameEntryMode,
    setIsHost,
    gameEntryMode,
  } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();
  const { setScreen } = useQuizSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsHost(true);
  }, []);

  const onFinishedPressed = async () => {
    if (loading) return;

    if (gameEntryMode === GameEntryMode.Host) {
      setIsHost(true);
      setScreen(QuizGameScreen.Game);
      return;
    }

    if (gameEntryMode !== GameEntryMode.Creator) {
      setIsHost(false);
      setScreen(QuizGameScreen.Lobby);
      return;
    }

    setLoading(true);
    const result = await gameService().createSession(pseudoId, GameType.Quiz);

    if (result.isError()) {
      console.error("Failed to create game session", result.error);
      setLoading(false);
      displayErrorModal("Klarte ikke opprette spill, forsøk på nytt", () => {
        navigation.goBack();
      });
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameSessionValues(result.value.key, result.value.hub_name, result.value.game_id);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(QuizGameScreen.Lobby);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} />;
};

export default TutorialScreen;
