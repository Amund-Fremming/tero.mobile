import { GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useToastProvider } from "@/src/core/context/ToastProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const TutorialScreen = () => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const {
    setSessionDataValues: setGameSessionValues,
    setGameEntryMode,
    setIsHost,
    gameEntryMode,
  } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();
  const { setScreen, setQuizSession } = useQuizSessionProvider();
  const { displayClickableToast, closeClickableToast } = useToastProvider();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsHost(true);
    if (gameEntryMode !== GameEntryMode.Creator) return;
    const t = setTimeout(() => {
      displayClickableToast(
        "Generer et spill for deg",
        "Trykk her for å generere og åpne et spill direkte",
        handleRandomGame,
      );
    }, 1500);
    return () => {
      clearTimeout(t);
      closeClickableToast();
    };
  }, []);

  const handleRandomGame = async () => {
    const result = await gameService().initiateRandomStaticGame<QuizSession>(GameType.Quiz, pseudoId);
    if (result.isError()) {
      displayInfoModal("Ingen tilfeldige spill klare, forsøk igjen senere");
      return;
    }

    let session = result.value;
    setQuizSession(session);
    setScreen(QuizGameScreen.Game);
  };

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
