import Color from "@/src/Common/constants/Color";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import { Text, View } from "react-native";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import styles from "./gameScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";

export const GameScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Gjenstående spørsmål:</Text>
      <AbsoluteHomeButton />
    </View>
  );
};
