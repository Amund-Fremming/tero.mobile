import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { HubChannel } from "@/src/common/constants/HubChannel";
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
  const { connect, setListener, invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, hubAddress, setIsHost, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon, clearSpinSessionValues } = useSpinSessionProvider();

  const [startGameTriggered, setStartGameTriggered] = useState<boolean>(false);
  const [round, setRound] = useState<string>("");
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);
  const [isAddingRound, setIsAddingRound] = useState<boolean>(false);

  useEffect(() => {
    createHubConnecion();
  }, []);

  const handleSetRound = (value: string) => {
    setRound(value);
  };

  const createHubConnecion = async () => {
    const result = await connect(hubAddress);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      return;
    }

    setListener("host", (hostId: string) => {
      if (hostId == pseudoId) {
        console.debug("New host elected:", hostId);
        setIsHost(pseudoId === hostId);
      }
    });

    setListener("players_count", (players: number) => {
      setPlayers(players);
    });

    setListener(HubChannel.Error, (message: string) => {
      displayErrorModal(message);
    });

    setListener(HubChannel.Iterations, (iterations: number) => {
      setIterations(iterations);
    });

    setListener("signal_start", (_value: boolean) => {
      setScreen(SpinSessionScreen.Game);
    });

    const groupResult = await invokeFunction("ConnectToGroup", gameKey, pseudoId, false);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Klarte ikke koble til, forsøk å lukke appen og start på nytt");
      return;
    }
  };

  const handleAddRound = async () => {
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
      displayErrorModal("En feil har skjedd");
      setStartGameTriggered(false);
      return;
    }

    if (!gameKey || gameKey == "") {
      displayErrorModal("En feil har skjedd, fosøk å opprette spillet på nytt");
      setStartGameTriggered(false);
      return;
    }

    let minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Minimum ${minPlayers} spillere for å starte, du har: ${players}`);
      setStartGameTriggered(false);
      return;
    }

    if (iterations < 1) {
      // TODO set to 10!
      displayInfoModal("Minimum 10 runder for å starte spillet");
      setStartGameTriggered(false);
      return;
    }

    const startResult = await invokeFunction("StartGame", gameKey);
    if (startResult.isError()) {
      console.log(startResult.error);
      displayErrorModal("En feil skjedde når spillet skulle starte");
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

export default ActiveLobbyScreen;
