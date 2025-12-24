import { View, Text, Pressable } from "react-native";
import styles from "./lobbyScreenStyles";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import Color from "@/src/Common/constants/Color";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { connect, setListener, invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, hubAddress, setIsHost, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen } = useSpinGameProvider();

  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);
  const [round, setRound] = useState<string>("");

  useEffect(() => {
    createHubConnecion();
  }, []);

  const createHubConnecion = async () => {
    const result = await connect(hubAddress);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      return;
    }

    setListener("host", (hostId: string) => {
      console.info("Received new host:", hostId);
      setIsHost(pseudoId == hostId);
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
    const result = await invokeFunction("AddRound", gameKey, round);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til runde, forsøk igjen");
      return;
    }

    setRound("");
  };

  const handleStartGame = async () => {
    if (!pseudoId) {
      // TODO  handle
      console.error("No pseudo id present");
      return;
    }

    if (players < 3) {
      displayInfoModal(`Minimum 3 spillere for å starte, du har: ${players}`);
      return;
    }

    setScreen(SpinSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    await disconnect();
    navigation.goBack();
    clearGlobalSessionValues();
  };

  return (
    <View style={styles.container}>
      <View>
        <Pressable onPress={handleBackPressed}>
          <Feather name="chevron-left" size={45} />
        </Pressable>
      </View>
      <Text>{players} Players</Text>
      <Text>Spin game</Text>
      <Text style={styles.gameKey}>ID: {gameKey?.toUpperCase()}</Text>
      <Text style={styles.header}>Legg til spørsmål</Text>
      <Text style={styles.paragraph}>Antall spørsmål: {iterations}</Text>
      <TextInput style={styles.input} value={round} onChangeText={(input) => setRound(input)} />
      <MediumButton text="Legg til" color={Color.Beige} onClick={handleAddRound} />
      {isHost && <MediumButton text="Start" color={Color.Beige} onClick={handleStartGame} inverted />}
    </View>
  );
};

export default LobbyScreen;
