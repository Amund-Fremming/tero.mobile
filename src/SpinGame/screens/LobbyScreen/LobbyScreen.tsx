import { View, Text } from "react-native";
import styles from "./lobbyScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import Screen from "@/src/Common/constants/Screen";
import { GameEntryMode } from "@/src/Common/constants/Types";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import SpinGame from "../../SpinGame";
import AddChallenge from "../../components/AddChallenge/AddChallenge";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import Color from "@/src/Common/constants/Color";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";

export const LobbyScreen = ({ navigation }: any) => {
  const { pseudoId } = useAuthProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();
  const { gameKey, gameEntryMode, hubAddress } = useGlobalGameProvider();

  const [iterations, setIterations] = useState<number>(0);
  const [round, setRound] = useState<string>("");

  useEffect(() => {
    createHubConnecion();
  }, []);

  const createHubConnecion = async () => {
    const result = await connect(hubAddress);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En fail har skjedd, forsøk å gå ut og inn av spillet");
      return;
    }

    const connectResult = await invokeFunction("ConnectToGroup", gameKey, pseudoId);
    if (connectResult.isError()) {
      console.error(connectResult.error);
      displayErrorModal("Klarte ikke koble til, forsøk å lukke appen og start på nytt");
      return;
    }

    setListener(HubChannel.Iterations, (iterations: number) => {
      setIterations(iterations);
    });
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
    //
  };

  return (
    <View style={styles.container}>
      <Text>Spin game</Text>
      <Text>Universal game id: {gameKey}</Text>
      <Text style={styles.header}>Legg til spørsmål</Text>
      <Text style={styles.paragraph}>Antall spørsmål: {iterations}</Text>
      <TextInput style={styles.input} value={round} onChangeText={(input) => setRound(input)} />
      <MediumButton text="Legg til" color={Color.Beige} onClick={handleAddRound} />
      {gameEntryMode === GameEntryMode.Creator && (
        <MediumButton text="Start" color={Color.Beige} onClick={handleStartGame} inverted />
      )}
      <AbsoluteHomeButton />
    </View>
  );
};

export default LobbyScreen;
