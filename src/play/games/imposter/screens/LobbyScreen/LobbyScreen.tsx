import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { validMaxLength } from "@/src/core/utils/InputValidator";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericActiveLobbyScreen from "@/src/play/screens/GenericActiveLobbyScreen/GenericActiveLobbyScreen";
import LobbyTextInput from "@/src/play/screens/GenericActiveLobbyScreen/LobbyTextInput";
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
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(GameType.Imposter);

  const [started, setStarted] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handleAddRound = async (round: string) => {
    if (round.trim() === "") {
      return;
    }

    if (!validMaxLength(round, 40, displayErrorModal)) return;

    setInput("");
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

    if (iterations < 10) {
      displayInfoModal("Du må legge til minst 10 runder før du kan starte spillet.", "Ikke nok runder");
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", sessionData.gameKey);

    if (result.isError()) {
      console.error(result.error);
      displayInfoModal("Du må legge til minst 10 runder før du kan starte spillet.", "Ikke nok runder");
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
      customInput={
        <LobbyTextInput
          value={input}
          onChangeText={setInput}
          onSubmit={() => handleAddRound(input)}
          placeholder="Tema for runden..."
          buttonColor={theme.secondaryColor}
        />
      }
    />
  );
};

export default LobbyScreen;
