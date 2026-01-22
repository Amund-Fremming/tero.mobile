import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/Common/constants/Types";
import SimpleInitScreen from "@/src/Common/screens/SimpleInitScreen/SimpleInitScreen";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { connect, setListener, invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, hubAddress, setIsHost, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon, clearSpinSessionValues } = useSpinGameProvider();

  const [round, setRound] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);
  const [isAddingRound, setIsAddingRound] = useState<boolean>(false);

  useEffect(() => {
    console.log("GameType=" + gameType);
    console.log("Is host: " + isHost);
    createHubConnecion();
  }, []);

  const handleSetRound = (value: string) => {
    setRound(value);
  };

  const createHubConnecion = async () => {
    console.log("Hub address:", hubAddress);
    const result = await connect(hubAddress);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      return;
    }

    // TODO REMOVE DEBUG
    setListener("host", (hostId: string) => {
      const currentPseudoId = pseudoId; // Capture at call time
      console.warn("=== HOST MESSAGE DEBUG ===");
      console.info("Received hostId from server:", hostId);
      console.info("My current pseudoId:", currentPseudoId);
      console.info("Type of hostId:", typeof hostId);
      console.info("Type of pseudoId:", typeof currentPseudoId);
      console.info("Strict comparison (===):", currentPseudoId === hostId);
      console.info("Loose comparison (==):", currentPseudoId == hostId);
      console.warn("=========================");
      // Use strict equality with type conversion to handle type mismatches
      setIsHost(String(currentPseudoId) === String(hostId));
    });

    setListener("players_count", (players: number) => {
      console.info("Received players count:", players);
      setPlayers(players);
    });

    setListener(HubChannel.Error, (message: string) => {
      console.info("Received error:", message);
      displayErrorModal(message);
    });

    setListener(HubChannel.Iterations, (iterations: number) => {
      console.info("Received iterations:", iterations);
      setIterations(iterations);
    });

    setListener("signal_start", (_value: boolean) => {
      console.info("Received start signal");
      setScreen(SpinSessionScreen.Game);
    });

    const groupResult = await invokeFunction("ConnectToGroup", gameKey, pseudoId);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Klarte ikke koble til, forsøk å lukke appen og start på nytt");
      return;
    }
  };

  const handleAddRound = async () => {
    console.log("Is host: " + isHost);

    if (isAddingRound) {
      return;
    }

    if (round === "") {
      displayInfoModal("Du har glemt å skrive inn en runde");
      return;
    }

    setIsAddingRound(true);
    const result = await invokeFunction("AddRound", gameKey, round);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til runde");
      setTimeout(() => setIsAddingRound(false), 500);
      return;
    }

    setRound("");
    setTimeout(() => setIsAddingRound(false), 1000);
  };

  const handleStartGame = async () => {
    if (started) {
      return;
    }

    if (!pseudoId) {
      console.error("No pseudo id present");
      displayErrorModal("En feil har skjedd");
      return;
    }

    let minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Minimum ${minPlayers} spillere for å starte, du har: ${players}`);
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", gameKey);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke starte spill");
      setStarted(false);
      return;
    }

    await disconnect();
    setScreen(SpinSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    await disconnect();
    navigation.goBack();
    clearGlobalSessionValues();
    clearSpinSessionValues();
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <SimpleInitScreen
      isHost={isHost}
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

export default LobbyScreen;
