import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeGlobal } from "@/src/core/utils/navigationRef";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericActiveLobbyScreen from "@/src/play/screens/GenericActiveLobbyScreen/GenericActiveLobbyScreen";
import LobbyTextInput from "@/src/play/screens/GenericActiveLobbyScreen/LobbyTextInput";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";

export const ActiveLobbyScreen = () => {
  const { invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal, displayActionModal } = useModalProvider();
  const { sessionData: sessionData, gameType, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon, clearSpinSessionValues, iterations, players } =
    useSpinSessionProvider();

  const [startGameTriggered, setStartGameTriggered] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const prevIterationsRef = useRef(iterations);

  useEffect(() => {
    if (iterations > prevIterationsRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevIterationsRef.current = iterations;
  }, [iterations]);

  const handleAddRound = async (round: string) => {
    if (round.trim() === "") {
      return;
    }

    const trimmedRound = round.trim();
    setInput("");
    const result = await invokeFunction("AddRound", sessionData.gameKey, trimmedRound);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til runde.");
      return;
    }
  };

  const handleStartGame = async () => {
    if (startGameTriggered) {
      return;
    }

    setStartGameTriggered(true);
    if (!isHost) {
      console.error("Only hosts can start a game");
      setStartGameTriggered(false);
      return;
    }

    if (!sessionData.gameKey || sessionData.gameKey == "") {
      displayErrorModal("Mangler spillkode. Lag spillet på nytt.");
      setStartGameTriggered(false);
      return;
    }

    const minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Må ha minst ${minPlayers} spillere for å starte.`);
      setStartGameTriggered(false);
      return;
    }

    if (iterations < 10) {
      displayInfoModal("Minst 10 runder.");
      setStartGameTriggered(false);
      return;
    }

    const startResult = await invokeFunction("StartGame", sessionData.gameKey);
    if (startResult.isError()) {
      console.error(startResult.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStartGameTriggered(false);
      return;
    }

    const gameReady = startResult.value;
    if (!gameReady) {
      console.debug("Game not ready");
      setStartGameTriggered(false);
      return;
    }

    setScreen(SpinSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      async () => {
        await disconnect();
        clearGlobalSessionValues();
        clearSpinSessionValues();
        resetToHomeGlobal();
      },
      () => {},
    );
  };

  const handleInfoPressed = () => {
    if (gameType === GameType.Duel) {
      displayInfoModal("Her skal du legge inn duellen som de som blir valgt må utføre.", "Legg til!");
    }
    if (gameType === GameType.Roulette) {
      displayInfoModal("Her skal du legge inn hva taperen i ruletten må gjøre eller svare på.", "Legg til!");
    }
  };

  return (
    <GenericActiveLobbyScreen
      themeColor={themeColor}
      secondaryThemeColor={secondaryThemeColor}
      featherIcon={featherIcon}
      iterations={iterations}
      inputPlaceholder="Taperen må..."
      bottomButtonText="Start spill"
      onStartPressed={handleStartGame}
      onAddRoundPressed={handleAddRound}
      onBackPressed={handleBackPressed}
      onInfoPressed={handleInfoPressed}
      customInput={
        <LobbyTextInput
          value={input}
          onChangeText={setInput}
          onSubmit={() => handleAddRound(input)}
          placeholder="Taperen må..."
          buttonColor={secondaryThemeColor}
        />
      }
    />
  );
};

export default ActiveLobbyScreen;
