import Color from "@/src/core/constants/Color";
import { GameCategory } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { invokeFunction } = useHubConnectionProvider();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setScreen } = useQuizSessionProvider();
  const { gameSession } = useGlobalSessionProvider();
  const { gameId } = gameSession;

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePersistGame = async (name: string, category: GameCategory) => {
    const success = invokeFunction("PersistGame", gameSession.gameKey, name, category);
    if (!success) {
      console.error("Failed to persist game");
      displayErrorModal("Klarte ikke lagre spill korrekt. Spillet ditt finnes fortsatt men med ett annet navn.");
      return;
    }

    displayInfoModal("Takk for at du lagret spillet ditt!", "Suksess", () => {
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
      bottomButtonText="Opprett"
      handlePatchGame={handlePersistGame}
      featherIcon="stack"
    />
  );
};

export default CreateScreen;
