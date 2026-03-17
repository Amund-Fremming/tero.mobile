import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { GameType } from "@/src/core/constants/Types";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./startedScreenStyles";

export const StartedScreen = () => {
  const navigation: any = useNavigation();

  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues } = useImposterSessionProvider();
  const { disconnect } = useHubConnectionProvider();

  const handleLeave = () => {
    resetToHomeScreen(navigation);
    clearImposterSessionValues();
    disconnect();
  };

  const theme = getGameTheme(GameType.Imposter);

  return (
    <View style={{ ...styles.container, backgroundColor: theme.primaryColor }}>
      <ScreenHeader title="" onBackPressed={handleLeave} />

      <View style={styles.textBox}>
        <Text style={{ ...styles.header, color: Color.White }}>Spillet har startet!</Text>
        <Text style={styles.subHeader}>
          Du kan legge vekk telefonen, spillet vil bli spilt videre på en annen telefon
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLeave}>
        <Text style={styles.buttonText}>Hjem</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartedScreen;
