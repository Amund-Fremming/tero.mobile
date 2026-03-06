import Color from "@/src/core/constants/Color";
import { CreateStaticGameRequest, GameCategory } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { invokeFunction } = useHubConnectionProvider();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setScreen, quizSession } = useQuizSessionProvider();
  const { gameSession, gameType } = useGlobalSessionProvider();
  const { gameId } = gameSession;

  const [loading, setLoading] = useState(false);

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePersistGame = async (name: string, category: GameCategory) => {
    if (loading) {
      return;
    }

    setLoading(true);
    const request: CreateStaticGameRequest = {
      name,
      category,
      rounds: quizSession?.rounds ?? [],
    };

    const result = await gameService().persistStaticGame(pseudoId, gameType, request);
    if (result.isError()) {
      console.error("Failed to persist game");
      displayErrorModal("Klarte ikke lagre spill, forsøk igjen senere", () => {
        setLoading(false);
        resetToHomeScreen(navigation);
      });
      return;
    }

    displayInfoModal("Takk for at du lagret spillet ditt!", "Suksess", () => {
      setLoading(false);
      resetToHomeScreen(navigation);
    });
  };

  return (
    <GenericCreateScreen
      themeColor={Color.LighterGreen}
      secondaryThemeColor={Color.DeepForest}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Lagre"
      bottomButtonText="Publiser"
      handleCreateGame={handlePersistGame}
      featherIcon="stack"
    />
  );
};

export default CreateScreen;
