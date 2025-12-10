import Color from "@/src/Common/constants/Color";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styles from "./lobbyScreenStyles";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import Screen from "@/src/Common/constants/Screen";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { GameEntryMode } from "@/src/Common/constants/Types";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import { QuizSession } from "../../constants/quizTypes";

export const LobbyScreen = ({ navigation }: any) => {
  const [question, setQuestion] = useState<string>("");

  const { gameEntryMode, gameKey, hubAddress } = useGlobalGameProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();
  const { setQuizSession, setIterations, iterations } = useQuizGameProvider();

  useEffect(() => {
    if (gameKey) {
      createHubConnection();
    }
  }, [gameKey]);

  const createHubConnection = async () => {
    const result = await connect(hubAddress);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    const connectResult = await invokeFunction("ConnectToGroup", gameKey);
    if (connectResult.isError()) {
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      await disconnect();
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

    setListener(HubChannel.Game, async (game: QuizSession) => {
      setQuizSession(game);
      // TODO - set scrfeen in quiz context provider
      await disconnect();
    });
  };

  const handleAddQuestion = async () => {
    const result = await invokeFunction("AddQuestion", gameKey, question);
    if (result.isError()) {
      displayErrorModal("Klarte ikke legge til spørsmål");
    }
  };

  const handleStartGame = async () => {
    //
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
