import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useNavigation } from "expo-router";
import { Text, View } from "react-native";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./startedScreenStyles";

export const StartedScreen = () => {
  const navigation: any = useNavigation();
  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues } = useImposterSessionProvider();

  const handleGoHome = () => {
    clearGlobalSessionValues();
    clearImposterSessionValues();
    resetToHomeScreen(navigation);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="" onBackPressed={handleGoHome} />
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
