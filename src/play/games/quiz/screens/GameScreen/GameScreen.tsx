import Color from "@/src/core/constants/Color";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";
import styles from "./gameScreenStyles";

type Props = {
  onLeave: () => void;
};

export const GameScreen = ({ onLeave }: Props) => {
  const navigation: any = useNavigation();
  const { quizSession } = useQuizSessionProvider();
  const { gameEntryMode } = useGlobalSessionProvider();
  const { clearQuizGameValues, setScreen } = useQuizSessionProvider();
  const { displayInfoModal } = useModalProvider();

  const [quiz, setQuiz] = useState<QuizSession | undefined>(quizSession);

  useEffect(() => {
    setQuiz(quizSession);
  }, [quizSession]);

  const handlePrevPressed = () => {
    if (quiz?.current_iteration === 0) {
      return;
    }

    setQuiz((prev) => {
      if (!prev) return prev;
      if (prev.current_iteration == 0) return prev;
      return { ...prev, current_iteration: prev.current_iteration - 1 };
    });
  };

  const handleNextPressed = () => {
    if ((quiz?.current_iteration ?? 0) + 1 === (quiz?.rounds.length ?? 0)) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuiz((prev) => {
      if (!prev) return prev;
      if (prev.current_iteration == prev.rounds.length - 1) return prev;
      return { ...prev, current_iteration: prev.current_iteration + 1 };
    });
  };

  const handleInfoPressed = () => {
    displayInfoModal(
      "Her kan du spillet som du vil. Svar på spørsmålene i rundgang, send mobilen rundt og la den som leser svare eller spill det som 100 spørsmål!",
      "Hvordan spille?",
    );
  };

  const handleFinishedPressed = () => {
    if (gameEntryMode === GameEntryMode.Creator) {
      setScreen(QuizGameScreen.Create);
    } else {
      resetToHomeScreen(navigation);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={onLeave} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <Text style={styles.header}>
          {(quiz?.current_iteration ?? 0) + 1} / {quiz?.rounds.length ?? 1}
        </Text>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.question}>{quiz?.rounds[quiz.current_iteration]}</Text>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.nextButton} onPress={handlePrevPressed}>
          <Text style={styles.nextText}>Forrige</Text>
        </TouchableOpacity>
        {(quiz?.current_iteration ?? 0) + 1 === (quiz?.rounds.length ?? 0) ? (
          <TouchableOpacity
            style={{ ...styles.prevButton, backgroundColor: Color.Green }}
            onPress={handleFinishedPressed}
          >
            <Text style={styles.prevText}>Fullfør</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ ...styles.prevButton, backgroundColor: Color.Black }} onPress={handleNextPressed}>
            <Text style={styles.prevText}>Neste</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
