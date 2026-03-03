import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeGlobal } from "@/src/core/utils/navigationRef";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import SimpleInitScreen from "@/src/play/screens/SimpleInitScreen/SimpleInitScreen";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";

export const ActiveLobbyScreen = () => {
  const { invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal, displayActionModal } = useModalProvider();
  const { gameKey, gameType, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon, clearSpinSessionValues, iterations, players } =
    useSpinSessionProvider();

  const [startGameTriggered, setStartGameTriggered] = useState<boolean>(false);
  const [round, setRound] = useState<string>("");
  const [isAddingRound, setIsAddingRound] = useState<boolean>(false);
  const prevIterationsRef = useRef(iterations);

  useEffect(() => {
    if (iterations > prevIterationsRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevIterationsRef.current = iterations;
  }, [iterations]);

  const handleSetRound = (value: string) => {
    setRound(value);
  };

  const handleAddRound = async () => {
    if (isAddingRound) {
      return;
    }

    if (round === "") {
      return;
    }

    setIsAddingRound(true);
    const roundToAdd = round;
    setRound("");
    const result = await invokeFunction("AddRound", gameKey, roundToAdd);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til runde.");
      setIsAddingRound(false);
      return;
    }

    setRound("");
    setIsAddingRound(false);
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

    if (!gameKey || gameKey == "") {
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

    if (iterations < 1) {
      // TODO set to 10!
      displayInfoModal("Minst 10 runder.");
      setStartGameTriggered(false);
      return;
    }

    const startResult = await invokeFunction("StartGame", gameKey, true); // isDraft = true
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
    <SimpleInitScreen
      createScreen={false}
      themeColor={themeColor}
      secondaryThemeColor={secondaryThemeColor}
      onBackPressed={handleBackPressed}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      topButtonText="Leggt til"
      topButtonOnChange={() => {}}
      topButtonOnPress={handleAddRound}
      bottomButtonText="Start spill"
      bottomButtonCallback={handleStartGame}
      featherIcon={featherIcon}
      iterations={iterations}
      inputPlaceholder="Taperen må..."
      inputValue={round}
      setInput={handleSetRound}
    />
  );
};

export default ActiveLobbyScreen;
