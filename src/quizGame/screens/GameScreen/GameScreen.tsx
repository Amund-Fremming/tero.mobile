import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";
import styles from "./gameScreenStyles";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { QuizSession } from "../../constants/quizTypes";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { resetToHomeScreen } from "@/src/Common/utils/navigation";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const { quizSession } = useQuizSessionProvider();
  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearQuizGameValues } = useQuizSessionProvider();

  const [quiz, setQuiz] = useState<QuizSession | undefined>(quizSession);

  useEffect(() => {
    setQuiz(quizSession);
  }, [quizSession]);

  const handlePrevPressed = () => {
    if (quiz?.current_iteration === 0) {
      console.log("Tried getting prev when at iteration:", quiz?.current_iteration);
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
      console.log("Tried getting next when at max iteration");
      return;
    }

    setQuiz((prev) => {
      if (!prev) return prev;
      if (prev.current_iteration == prev.rounds.length - 1) return prev;
      return { ...prev, current_iteration: prev.current_iteration + 1 };
    });
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  const handleLeaveGame = () => {
    clearGlobalSessionValues();
    clearQuizGameValues();
    resetToHomeScreen(navigation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleLeaveGame} style={styles.iconWrapper}>
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
        <TouchableOpacity style={styles.prevButton} onPress={handleNextPressed}>
          <Text style={styles.prevText}>Neste</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
