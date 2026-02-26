import { View, Text } from "react-native";
import styles from "./startedScreenStyles";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";

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
      <ScreenHeader title="Velg spill" onBackPressed={handleGoHome} />
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
