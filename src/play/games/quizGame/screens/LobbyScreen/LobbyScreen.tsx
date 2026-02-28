import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";
import { QuizGameScreen } from "../../constants/quizTypes";
import { useNavigation } from "expo-router";
import SimpleInitScreen from "@/src/play/screens/SimpleInitScreen/SimpleInitScreen";
import Color from "@/src/core/constants/Color";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const [question, setQuestion] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);

  const { gameKey, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal, displayActionModal } = useModalProvider();
  const { setScreen, iterations, clearQuizGameValues } = useQuizSessionProvider();

  const prevIterationsRef = useRef(iterations);

  useEffect(() => {
    if (iterations > prevIterationsRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevIterationsRef.current = iterations;
  }, [iterations]);

  const handleSetQuestion = (value: string) => {
    setQuestion(value);
  };

  const handleAddQuestion = async () => {
    if (isAddingQuestion) {
      return;
    }

    if (question === "") {
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

  const handleBackPressed = () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      () => {
        disconnect();
        clearQuizGameValues();
        clearGlobalSessionValues();
        resetToHomeScreen(navigation);
      },
      () => {},
    );
  };

  return (
    <SimpleInitScreen
      createScreen={false}
      themeColor={Color.LighterGreen}
      secondaryThemeColor={Color.DeepForest}
      onBackPressed={handleBackPressed}
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
