import { Pressable, Text } from "react-native";
import styles from "./absoluteHomeButtonStyles";
import Screen from "../../constants/Screen";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useGlobalGameProvider } from "../../context/GlobalGameProvider";
import { useQuizGameProvider } from "@/src/quizGame/context/QuizGameProvider";
import Color from "../../constants/Color";

interface AbsoluteHomeButtonProps {
  primary?: string;
  secondary?: string;
}

export const AbsoluteHomeButton = ({ primary = Color.Black, secondary = Color.White }: AbsoluteHomeButtonProps) => {
  const navigation: any = useNavigation();

  const { disconnect } = useHubConnectionProvider();
  const { clearQuizGameValues } = useQuizGameProvider();
  const { clearValues } = useGlobalGameProvider();

  const handlePress = async () => {
    clearQuizGameValues();
    clearValues();
    await disconnect();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Screen.Home }],
      })
    );
  };

  return (
    <Pressable style={{ ...styles.button, backgroundColor: primary }} onPress={handlePress}>
      <Text style={{ ...styles.label, color: secondary }}>Hjem</Text>
    </Pressable>
  );
};

export default AbsoluteHomeButton;
