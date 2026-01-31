import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./passiveLobbyScreenStyles";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/common/utils/dimensions";
import { useNavigation } from "expo-router";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { resetToHomeScreen } from "@/src/common/utils/navigation";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";

export const PassiveLobbyScreen = () => {
  const navigation: any = useNavigation();
  const { gameKey, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { themeColor, clearSpinSessionValues } = useSpinSessionProvider();
  const { disconnect } = useHubConnectionProvider();

  const handleBackPressed = async () => {
    await disconnect();
    clearGlobalSessionValues();
    clearSpinSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <View style={styles.headerInline}>
          <Text style={styles.toastHeader}>Rom:</Text>
          <Text style={styles.headerSecondScreen}>{gameKey?.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.centerText}>venter på at sjefen starter spillet</Text>
    </View>
  );
};

export default PassiveLobbyScreen;
