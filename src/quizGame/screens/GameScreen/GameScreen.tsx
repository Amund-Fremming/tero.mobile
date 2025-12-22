import { Pressable, Text, View } from "react-native";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import styles from "./gameScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { QuizSession } from "../../constants/quizTypes";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import Screen from "@/src/Common/constants/Screen";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const { quizSession } = useQuizGameProvider();
  const { displayErrorModal } = useModalProvider();

  const [quiz, setQuiz] = useState<QuizSession | undefined>(quizSession);

  useEffect(() => {
    //
  }, []);

  useEffect(() => {
    setQuiz(quizSession);
  }, [quizSession]);

  const handlePrevPressed = () => {
    setQuiz((prev) => {
      if (!prev) return prev;
      if (prev.current_iteration == 0) return prev;
      return { ...prev, current_iteration: prev.current_iteration - 1 };
    });
  };

  const handleNextPressed = () => {
    setQuiz((prev) => {
      if (!prev) return prev;
      if (prev.current_iteration == prev.iterations - 1) return prev;
      return { ...prev, current_iteration: prev.current_iteration + 1 };
    });
  };

  return (
    <View style={styles.container}>
      <Text>
        Gjenstående spørsmål: {(quiz?.current_iteration ?? 0) + 1}/{quiz?.iterations ?? 1}
      </Text>

      <Text>{quiz?.questions[quiz.current_iteration]}</Text>

      {quiz && <Text>s</Text>}

      {quiz && (
        <View>
          {quiz.current_iteration > 0 && (
            <Pressable onPress={handlePrevPressed}>
              <Text>Forrige</Text>
            </Pressable>
          )}
          {quiz.current_iteration < quiz.iterations - 1 && (
            <Pressable onPress={handleNextPressed}>
              <Text>Neste</Text>
            </Pressable>
          )}
        </View>
      )}

      <AbsoluteHomeButton />
    </View>
  );
};
