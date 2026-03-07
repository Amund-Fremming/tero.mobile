import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

interface TutorialScreenProps {
  onGameCreated: (hubName: string, gameKey: string) => Promise<void>;
}

export const TutorialScreen = ({ onGameCreated }: TutorialScreenProps) => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const {
    setSessionDataValues: setGameSessionValues,
    setGameEntryMode,
    gameType,
    setIsHost,
  } = useGlobalSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsHost(true);
  }, []);

  const onFinishedPressed = async () => {
    if (loading) return;

    setLoading(true);
    const result = await gameService().createSession(pseudoId, gameType);

    if (result.isError()) {
      console.error("Failed to create game session", result.error);
      setLoading(false);
      displayErrorModal("Klarte ikke opprette spill, forsøk på nytt", () => {
        navigation.goBack();
      });
      return;
    }

    let data = result.value;
    console.info("Game initiated with key:", result.value.key);
    setGameSessionValues(data.key, data.hub_name, data.game_id);
    setGameEntryMode(GameEntryMode.Creator);

    // INFO: this function navigates to AddPlayersScreen
    await onGameCreated(result.value.hub_name, result.value.key);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} lastButtonText="Opprett spill" />;
};

export default TutorialScreen;
