import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useState } from "react";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/common/constants/Types";
import SimpleInitScreen from "@/src/common/screens/SimpleInitScreen/SimpleInitScreen";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const ActiveLobbyScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon, clearSpinSessionValues, iterations, players } =
    useSpinSessionProvider();

  const [startGameTriggered, setStartGameTriggered] = useState<boolean>(false);
  const [round, setRound] = useState<string>("");
  const [isAddingRound, setIsAddingRound] = useState<boolean>(false);

  const handleSetRound = (value: string) => {
    setRound(value);
  };

  const handleAddRound = async () => {
    if (isAddingRound) {
      return;
    }

    if (round === "") {
      displayInfoModal("Skriv inn en runde.");
      return;
    }

    setIsAddingRound(true);
    const result = await invokeFunction("AddRound", gameKey, round);

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

    if (!pseudoId) {
      console.error("No pseudo id present");
      displayErrorModal("Noe gikk galt.");
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
      displayInfoModal(`Minst ${minPlayers} spillere. Nå: ${players}.`);
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
      console.log(startResult.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStartGameTriggered(false);
      return;
    }

    const gameReady = startResult.value;
    if (!gameReady) {
      console.log("Game not ready");
      setStartGameTriggered(false);
      return;
    }

    setScreen(SpinSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    await disconnect();
    clearGlobalSessionValues();
    clearSpinSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
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
