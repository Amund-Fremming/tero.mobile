import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { HubChannel } from "@/src/common/constants/HubChannel";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useNavigation } from "expo-router";
import SimpleInitScreen from "@/src/common/screens/SimpleInitScreen/SimpleInitScreen";
import Color from "@/src/common/constants/Color";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const [question, setQuestion] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);

  const { gameKey, hubAddress } = useGlobalSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { setQuizSession, setScreen } = useQuizSessionProvider();

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

    setListener(HubChannel.Iterations, (iterations: number) => {
      setIterations(iterations);
    });

    setListener(HubChannel.Error, (message: string) => {
      disconnect();
      displayErrorModal(message, () => resetToHomeScreen(navigation));
    });

    setListener(HubChannel.Game, (game: QuizSession) => {
      setQuizSession(game);
    });

    setListener(HubChannel.State, (message: string) => {
      setScreen(QuizGameScreen.Started);
      disconnect();
    });

    console.debug("Connecting to group with key:", key);
    const connectResult = await invokeFunction("ConnectToGroup", key);
    if (connectResult.isError()) {
      displayErrorModal("Koblingsfeil. Bli med på nytt.");
      await disconnect();
      return;
    }
  };

  const handleAddQuestion = async () => {
    if (isAddingQuestion) {
      return;
    }

    if (question === "") {
      displayInfoModal("Skriv inn et spørsmål.");
      return;
    }

    setIsAddingQuestion(true);
    const result = await invokeFunction("AddQuestion", gameKey, question);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til spørsmål.");
      setIsAddingQuestion(false);
      return;
    }

    setQuestion("");
    setIsAddingQuestion(false);
  };

  const handleStartGame = async () => {
    if (started) {
      console.warn("Start game already in progress, ignoring duplicate call");
      return;
    }

    if (iterations < 1) {
      // TODO set to 10!
      displayInfoModal("Minst 10 spørsmål.");
      return;
    }

    setStarted(true);

    console.log("🎮 STARTING GAME: Calling StartGame for key:", gameKey);
    const result = await invokeFunction("StartGame", gameKey);

    if (result.isError()) {
      displayErrorModal("Kunne ikke starte spillet.");
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
      createScreen={false}
      themeColor={Color.LighterGreen}
      secondaryThemeColor={Color.LighterGreen}
      onBackPressed={() => {
        disconnect();
        resetToHomeScreen(navigation);
      }}
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
