import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useToastProvider } from "@/src/core/context/ToastProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { GuessSessionScreen } from "../../constants/GuessTypes";
import { useGuessSessionProvider } from "../../context/GuessGameProvider";

interface TutorialScreenProps {
  initializeHub: (hubName: string, gameKey: string) => Promise<void>;
}
export const TutorialScreen = ({ initializeHub }: TutorialScreenProps) => {
  const navigation: any = useNavigation();

  const { setScreen, setPlayers } = useGuessSessionProvider();
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

  const { displayClickableToast, closeClickableToast } = useToastProvider();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (gameEntryMode !== GameEntryMode.Creator) return;
    setIsHost(true);
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
    const result = await gameService().initiateRandomInteractiveGame(gameType, pseudoId);
    if (result.isError()) {
      displayInfoModal("Ingen tilfeldige spill klare, forsøk igjen senere");
      return;
    }

    let info = result.value;
    console.log(info);
    await initializeHub(info.hub_name, info.key);
    setSessionDataValues(info.key, info.hub_name, info.game_id);
    setGameEntryMode(GameEntryMode.Creator);
    setIsHost(true);
    setPlayers(1);
    setScreen(GuessSessionScreen.PassiveLobby);
  };

  const onFinishedPressed = async () => {
    if (loading) return;

    if (gameEntryMode !== GameEntryMode.Creator) {
      setIsHost(true);
      await initializeHub(sessionData.hubName, sessionData.gameKey);
      setScreen(isDraft ? GuessSessionScreen.ActiveLobby : GuessSessionScreen.PassiveLobby);
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
    console.log(data);
    setScreen(GuessSessionScreen.ActiveLobby);
    setLoading(true);
    setIsDraft(result.value.is_draft);
    setSessionDataValues(data.key, data.hub_name, data.game_id);
    await initializeHub(result.value.hub_name, result.value.key);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} />;
};

export default TutorialScreen;
