import * as Haptics from "expo-haptics";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Color from "../../constants/Color";
import { useThemeProvider } from "../../context/ThemeProvider";
import { styles } from "./loadingModalStyles";

interface LoadingModalProps {
  onCloseFunc?: () => void;
  message?: string;
}

export const LoadingModal = ({ onCloseFunc, message }: LoadingModalProps) => {
  const { darkMode, theme } = useThemeProvider();
  const bgOverride = darkMode ? { backgroundColor: theme.secondary } : {};
  const textOverride = darkMode ? { color: "#ffffff" } : {};
  return (
    <View style={styles.overlay}>
      <View style={[styles.container, bgOverride]}>
        <ActivityIndicator size="large" color={Color.BuzzifyLavender} style={{ marginVertical: 20 }} />
        <Text style={[styles.message, textOverride]}>
          {message ?? "Forbindelsen er brutt. Vi prøver å koble deg til igjen."}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onCloseFunc && onCloseFunc();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Avslutt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoadingModal;
