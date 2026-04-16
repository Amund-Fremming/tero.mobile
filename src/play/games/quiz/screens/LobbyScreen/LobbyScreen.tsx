import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { validMaxLength } from "@/src/core/utils/InputValidator";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericActiveLobbyScreen from "@/src/play/screens/GenericActiveLobbyScreen/GenericActiveLobbyScreen";
import LobbyTextInput from "@/src/play/screens/GenericActiveLobbyScreen/LobbyTextInput";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { QuizGameScreen } from "../../constants/quizTypes";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

type Props = {
  onLeave: () => void;
};

export const LobbyScreen = ({ onLeave }: Props) => {
  const [started, setStarted] = useState<boolean>(false);
  const [isAddingQuestion, setIsAddingRound] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { sessionData: sessionData } = useGlobalSessionProvider();
  const { disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { iterations, setScreen } = useQuizSessionProvider();
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(GameType.Quiz);

  const prevIterationsRef = useRef(iterations);

  useEffect(() => {
    if (iterations > prevIterationsRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevIterationsRef.current = iterations;
  }, [iterations]);

  const handleAddRound = async (questionToAdd: string) => {
    if (isAddingQuestion) {
      return;
    }

    if (questionToAdd.trim() === "") {
      return;
    }

    if (!validMaxLength(questionToAdd, 40, displayErrorModal)) return;

    setIsAddingRound(true);
    setInput("");
    const result = await invokeFunction("AddQuestion", sessionData.gameKey, questionToAdd);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til spørsmål.");
      setIsAddingRound(false);
      return;
    }

    setIsAddingRound(false);
  };

  const handleStartGame = async () => {
    if (started) {
      console.warn("Start game already in progress, ignoring duplicate call");
      return;
    }

    if (iterations < 10) {
      displayInfoModal("Minst 10 spørsmål.");
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", sessionData.gameKey);

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
    onLeave();
  };

  return (
    <GenericActiveLobbyScreen
      themeColor={theme.primaryColor}
      secondaryThemeColor={theme.secondaryColor}
      featherIcon="layers"
      iterations={iterations}
      inputPlaceholder="Spørsmål..."
      bottomButtonText="Start spill"
      onStartPressed={handleStartGame}
      onAddRoundPressed={handleAddRound}
      onBackPressed={handleBackPressed}
      onInfoPressed={handleInfoPressed}
      customInput={
        <LobbyTextInput
          value={input}
          onChangeText={setInput}
          onSubmit={() => handleAddRound(input)}
          placeholder="Spørsmål..."
          buttonColor={theme.secondaryColor}
        />
      }
    />
  );
};

export default LobbyScreen;
