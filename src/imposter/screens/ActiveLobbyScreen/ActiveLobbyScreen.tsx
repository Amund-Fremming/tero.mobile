import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { HubChannel } from "@/src/common/constants/HubChannel";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/common/constants/Types";
import SimpleInitScreen from "@/src/common/screens/SimpleInitScreen/SimpleInitScreen";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import Color from "@/src/common/constants/Color";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const ActiveLobbyScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { connect, setListener, invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, hubAddress, setIsHost, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues, setScreen } = useImposterSessionProvider();

  const [round, setRound] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);

  useEffect(() => {
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
      displayErrorModal("Koblingsfeil. Bli med på nytt.");
      return;
    }

    setListener("host", (hostId: string) => {
      setIsHost(pseudoId == hostId);
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
      setScreen(ImposterSessionScreen.Game);
    });

    const groupResult = await invokeFunction("ConnectToGroup", gameKey, pseudoId);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Kunne ikke koble til.");
      return;
    }
  };

  const handleAddRound = async () => {
    if (round === "") {
      displayInfoModal("Skriv inn en runde.");
      return;
    }

    const result = await invokeFunction("AddRound", gameKey, round);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til runde.");
      return;
    }

    setRound("");
  };

  const handleStartGame = async () => {
    if (started) {
      return;
    }

    if (!pseudoId) {
      console.error("No pseudo id present");
      displayErrorModal("Noe gikk galt.");
      return;
    }

    const minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Minst ${minPlayers} spillere. Nå: ${players}.`);
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", gameKey, true); // isDraft = true

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStarted(false);
      return;
    }

    await disconnect();
    setScreen(ImposterSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    await disconnect();
    clearGlobalSessionValues();
    clearImposterSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <SimpleInitScreen
      createScreen={false}
      themeColor={Color.LightGreen}
      secondaryThemeColor={Color.LighterGreen}
      onBackPressed={handleBackPressed}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      topButtonText="Velg kategori"
      topButtonOnChange={() => {}}
      topButtonOnPress={handleAddRound}
      bottomButtonText="Opprett"
      bottomButtonCallback={handleStartGame}
      featherIcon={"users"}
      iterations={iterations}
      inputPlaceholder="Spillnavn..."
      inputValue={round}
      setInput={handleSetRound}
    />
  );
};

export default ActiveLobbyScreen;
