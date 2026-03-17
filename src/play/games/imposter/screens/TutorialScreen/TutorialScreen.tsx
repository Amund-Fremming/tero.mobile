import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";

interface TutorialScreenProps {
  initiateHub: (hubName: string, gameKey: string) => Promise<void>;
}

export const TutorialScreen = ({ initiateHub }: TutorialScreenProps) => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setScreen } = useImposterSessionProvider();
  const { sessionData, setSessionDataValues, setGameEntryMode, gameType, setIsHost, gameEntryMode } =
    useGlobalSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);

  const onFinishedPressed = async () => {
    if (loading) return;
    setLoading(true);

    if (gameEntryMode !== GameEntryMode.Creator) {
      setIsHost(false);
      await initiateHub(sessionData.hubName, sessionData.gameKey);
      setScreen(ImposterSessionScreen.ActiveLobby);
      return;
    }

    const result = await gameService().createSession(pseudoId, gameType);

    if (result.isError()) {
      console.error("Failed to create game session", result.error);
      setLoading(false);
      displayErrorModal("Klarte ikke opprette spill, forsøk på nytt", () => {
        navigation.goBack();
      });
      return;
    }

    setIsHost(true);
    let data = result.value;
    console.info("Game initiated with key:", result.value.key);
    setSessionDataValues(data.key, data.hub_name, data.game_id);
    setGameEntryMode(GameEntryMode.Creator);

    await initiateHub(result.value.hub_name, result.value.key);
    setLoading(false);
    setScreen(ImposterSessionScreen.AddPlayers);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} />;
};

export default TutorialScreen;
