import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import Screen from "@/src/Common/constants/Screen";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useNavigation } from "expo-router";
import SimpleInitScreen from "@/src/Common/screens/SimpleInitScreen/SimpleInitScreen";
import Color from "@/src/Common/constants/Color";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const [question, setQuestion] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);

  const { pseudoId } = useAuthProvider();
  const { gameKey, hubAddress, isHost, setIsHost } = useGlobalSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { setQuizSession, setScreen } = useQuizGameProvider();

  useEffect(() => {
    if (gameKey) {
      createHubConnection(gameKey, hubAddress);
    }

    return () => {
      disconnect();
    };
  }, [gameKey]);

  const handleSetQuestion = (value: string) => {
    setQuestion(value);
  };

  const createHubConnection = async (key: string, address: string) => {
    const result = await connect(address);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    // Set up host listener to receive host updates from backend
    setListener("host", (hostId: string) => {
      const currentPseudoId = pseudoId; // Capture pseudoId at call time to avoid stale closure
      console.info("QuizGame - Received host:", hostId);
      console.info("QuizGame - My pseudoId:", currentPseudoId);
      // Use strict equality with type conversion to handle type mismatches
      setIsHost(String(currentPseudoId) === String(hostId));
    });

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
      console.log(`Received game session`);
      console.log("Questions: ", game.questions);
      setQuizSession(game);
    });

    setListener(HubChannel.State, (message: string) => {
      console.log("Received state message:", message);
      setScreen(QuizGameScreen.Started);
      disconnect();
    });

    console.debug("Connecting to group with key:", key);
    // Add pseudoId parameter to match SpinGame/Imposter pattern
    const connectResult = await invokeFunction("ConnectToGroup", key, pseudoId);
    if (connectResult.isError()) {
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      await disconnect();
      return;
    }
  };

  const handleAddQuestion = async () => {
    if (isAddingQuestion) {
      return;
    }

    if (question === "") {
      displayInfoModal("Du har glemt å skrive inn ett spørsmål");
      return;
    }

    setIsAddingQuestion(true);
    const result = await invokeFunction("AddQuestion", gameKey, question);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til spørsmål");
      setTimeout(() => setIsAddingQuestion(false), 500);
      return;
    }

    setQuestion("");
    setTimeout(() => setIsAddingQuestion(false), 500);
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

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <SimpleInitScreen
      isHost={isHost}
      createScreen={false}
      themeColor={Color.BuzzifyLavender}
      secondaryThemeColor={Color.BuzzifyLavenderLight}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="asdasd"
      topButtonText="Legg til"
      topButtonOnChange={() => {}}
      topButtonOnPress={handleAddQuestion}
      bottomButtonText="Start spill"
      bottomButtonCallback={handleStartGame}
      featherIcon="layers"
      iterations={iterations}
      inputPlaceholder="Spørsmål..."
      inputValue={question}
      setInput={handleSetQuestion}
    />
  );
};

export default LobbyScreen;
