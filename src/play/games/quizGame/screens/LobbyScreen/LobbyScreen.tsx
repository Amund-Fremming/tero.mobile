import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { HubChannel } from "@/src/core/constants/HubChannel";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useNavigation } from "expo-router";
import SimpleInitScreen from "@/src/play/screens/SimpleInitScreen/SimpleInitScreen";
import Color from "@/src/core/constants/Color";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const [question, setQuestion] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);

  const { gameKey, hubName } = useGlobalSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { setQuizSession, setScreen } = useQuizSessionProvider();

  useEffect(() => {
    if (gameKey) {
      createHubConnection(gameKey, hubName);
    }

    return () => {
      disconnect();
    };
  }, [gameKey]);

  const handleSetQuestion = (value: string) => {
    setQuestion(value);
  };

  const createHubConnection = async (key: string, hubName: string) => {
    const result = await connect(hubName);
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
    const toAdd = question;
    setQuestion("");
    const result = await invokeFunction("AddQuestion", gameKey, toAdd);

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
    displayInfoModal("Her skal du legge inn spørsmålene som skal være i spillet", "Legg til!");
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
