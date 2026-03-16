import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { Text, View } from "react-native";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";
import styles from "./startedScreenStyles";

export const StartedScreen = () => {
  const navigation: any = useNavigation();

  const { clearQuizGameValues } = useQuizSessionProvider();
  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { disconnect } = useHubConnectionProvider();

  const handleLeavePressed = async () => {
    await disconnect();
    clearQuizGameValues();
    clearGlobalSessionValues();
    resetToHomeScreen(navigation);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="" onBackPressed={handleLeavePressed} />
      <View style={styles.textBox}>
        <Text style={styles.header}>Spillet har startet!</Text>
        <Text style={styles.subHeader}>
          Ønsker du å styre spillet selv, kan du starte det ved å finne det under velg spill
        </Text>
      </View>
    </View>
  );
};

export default StartedScreen;
