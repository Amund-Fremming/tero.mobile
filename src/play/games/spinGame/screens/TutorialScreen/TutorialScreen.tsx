import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useToastProvider } from "@/src/core/context/ToastProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";

interface TutorialScreenProps {
  initializeHub: (hubName: string, gameKey: string) => Promise<void>;
}
export const TutorialScreen = ({ initializeHub }: TutorialScreenProps) => {
  const navigation: any = useNavigation();

  const { setScreen } = useSpinSessionProvider();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const {
    isDraft,
    setSessionDataValues,
    sessionData,
    gameEntryMode,
    setGameEntryMode,
    gameType,
    setIsHost,
    setIsDraft,
  } = useGlobalSessionProvider();

  const { displayClickableToast } = useToastProvider();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsHost(true);
    const t = setTimeout(() => {
      displayClickableToast("Generer et spill for deg", "Trykk her for å generere og åpne et spill direkte", () =>
        console.log("[TutorialScreen] Generate game clicked"),
      );
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const onFinishedPressed = async () => {
    if (loading) return;

    if (gameEntryMode !== GameEntryMode.Creator) {
      await initializeHub(sessionData.hubName, sessionData.gameKey);
      setScreen(isDraft ? SpinSessionScreen.ActiveLobby : SpinSessionScreen.PassiveLobby);
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

    const data = result.value;
    setScreen(SpinSessionScreen.ActiveLobby);
    setLoading(true);
    setIsDraft(result.value.is_draft);
    setSessionDataValues(data.key, data.hub_name, data.game_id);
    await initializeHub(result.value.hub_name, result.value.key);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} />;
};

export default TutorialScreen;
