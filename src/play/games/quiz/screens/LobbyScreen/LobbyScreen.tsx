import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import GenericActiveLobbyScreen from "@/src/play/screens/GenericActiveLobbyScreen/GenericActiveLobbyScreen";
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

  const { sessionData: sessionData } = useGlobalSessionProvider();
  const { disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { iterations, clearQuizGameValues, setScreen } = useQuizSessionProvider();
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

    setIsAddingRound(true);
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

    if (iterations < 1) {
      // TODO set to 10!
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
    />
  );
};

export default LobbyScreen;
