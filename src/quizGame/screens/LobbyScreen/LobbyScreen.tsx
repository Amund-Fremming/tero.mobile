import Color from "@/src/Common/constants/Color";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styles from "./lobbyScreenStyles";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import Screen from "@/src/Common/constants/Screen";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { GameEntryMode } from "@/src/Common/constants/Types";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useNavigation } from "expo-router";
import { SpinGameState } from "@/src/SpinGame/constants/SpinTypes";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const [question, setQuestion] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);

  const { gameEntryMode, gameKey, hubAddress } = useGlobalSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();
  const { setQuizSession, setScreen } = useQuizGameProvider();

  useEffect(() => {
    if (gameKey) {
      createHubConnection(gameKey, hubAddress);
    }

    return () => {
      disconnect();
    };
  }, [gameKey]);

  const createHubConnection = async (key: string, address: string) => {
    const result = await connect(address);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    setListener(HubChannel.Iterations, (iterations: number) => {
      console.log(`Received: ${iterations}`);
      setIterations(iterations);
    });

    setListener(HubChannel.Error, (message: string) => {
      console.log(`Received: ${message}`);
      disconnect();
      displayErrorModal(message, () => navigation.navigate(Screen.Home));
    });

    setListener(HubChannel.Game, (game: QuizSession) => {
      console.log("Received game session");
      setQuizSession(game);
    });

    setListener(HubChannel.State, (message: string) => {
      console.log("Received state message:", message);
      setScreen(QuizGameScreen.Started);
      disconnect();
    });

    console.debug("Connecting to group with key:", key);
    const connectResult = await invokeFunction("ConnectToGroup", key);
    if (connectResult.isError()) {
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      await disconnect();
      return;
    }
  };

  const handleAddQuestion = async () => {
    const result = await invokeFunction("AddQuestion", gameKey, question);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til spørsmål");
      return;
    }

    setQuestion("");
  };

  const handleStartGame = async () => {
    if (started) {
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
    setScreen(QuizGameScreen.Game);
  };

  return (
    <View style={styles.container}>
      <Text>Universal game id: {gameKey}</Text>
      <Text style={styles.header}>Legg til spørsmål</Text>
      <Text style={styles.paragraph}>Antall spørsmål: {iterations}</Text>
      <TextInput style={styles.input} value={question} onChangeText={(input) => setQuestion(input)} />
      <MediumButton text="Legg til" color={Color.Beige} onClick={handleAddQuestion} />
      {gameEntryMode === GameEntryMode.Creator && (
        <MediumButton text="Start" color={Color.Beige} onClick={handleStartGame} inverted />
      )}
      <AbsoluteHomeButton />
    </View>
  );
};

export default LobbyScreen;
