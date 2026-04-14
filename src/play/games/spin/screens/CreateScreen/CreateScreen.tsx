import { GameCategory } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useToastProvider } from "@/src/core/context/ToastProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();

  const { themeColor, secondaryThemeColor, featherIcon, clearSpinSessionValues } = useSpinSessionProvider();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { displayToast } = useToastProvider();
  const { invokeFunction, disconnect } = useHubConnectionProvider();
  const { sessionData, gameType } = useGlobalSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePersistGame = async (name: string, category: GameCategory) => {
    if (loading) return;

    setLoading(true);

    const result = await invokeFunction("PersistGame", sessionData.gameKey, gameType, name, category);
    if (result.isError() || !result.value) {
      console.error("Failed to persist game:", result.error);
      displayErrorModal("Klarte ikke lagre spill, forsøk igjen senere", () => {
        setLoading(false);
        resetToHomeScreen(navigation);
      });
      return;
    }

    displayToast(2.5);
    setLoading(false);
    clearSpinSessionValues();
    disconnect();
    resetToHomeScreen();
  };

  return (
    <GenericCreateScreen
      themeColor={themeColor}
      secondaryThemeColor={secondaryThemeColor}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      bottomButtonText="Publiser"
      handleCreateGame={handlePersistGame}
    />
  );
};

export default CreateScreen;
