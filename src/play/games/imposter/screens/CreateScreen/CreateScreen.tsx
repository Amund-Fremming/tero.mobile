import { CreateStaticGameRequest, GameCategory, GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useToastProvider } from "@/src/core/context/ToastProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const theme = getGameTheme(GameType.Imposter);
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { displayToast } = useToastProvider();
  const { imposterSession } = useImposterSessionProvider();
  const { gameType } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const [loading, setLoading] = useState<boolean>(false);

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
      rounds: imposterSession?.rounds ?? [],
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

    displayToast(2.5);
    resetToHomeScreen(navigation);
    setLoading(false);
  };

  return (
    <GenericCreateScreen
      handleCreateGame={handlePersistGame}
      themeColor={theme.primaryColor}
      secondaryThemeColor={theme.secondaryColor}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      bottomButtonText="Publiser"
    />
  );
};

export default CreateScreen;
