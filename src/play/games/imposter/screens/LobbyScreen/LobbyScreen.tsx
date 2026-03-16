import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericActiveLobbyScreen from "@/src/play/screens/GenericActiveLobbyScreen/GenericActiveLobbyScreen";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const { invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal, displayActionModal } = useModalProvider();
  const { sessionData: sessionData, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, iterations, clearImposterSessionValues } = useImposterSessionProvider();
  const theme = getGameTheme(GameType.Imposter);

  const [started, setStarted] = useState<boolean>(false);

  const handleAddRound = async (round: string) => {
    if (round === "") {
      return;
    }

    const result = await invokeFunction("AddRound", sessionData.gameKey, round);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til runde.");
      return;
    }
  };

  const handleStartGame = async () => {
    if (started) {
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", sessionData.gameKey);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStarted(false);
      return;
    }

    await disconnect();
    setScreen(ImposterSessionScreen.Roles);
  };

  const handleBackPressed = async () => {
    setScreen(ImposterSessionScreen.AddPlayers);
  };

  const handleInfoPressed = () => {
    displayInfoModal(
      "Skriv inn ordene dere vil bruke i spillet. I hver runde skal spillerne si en assosiasjon til ordet som blir valgt.",
      "Hva nå?",
    );
  };

  return (
    <GenericActiveLobbyScreen
      onStartPressed={handleStartGame}
      onAddRoundPressed={handleAddRound}
      themeColor={theme.primaryColor}
      secondaryThemeColor={theme.secondaryColor}
      onBackPressed={handleBackPressed}
      onInfoPressed={handleInfoPressed}
      bottomButtonText="Start spill"
      featherIcon={"users"}
      iterations={iterations}
      inputPlaceholder="Tema for runden..."
    />
  );
};

export default LobbyScreen;
