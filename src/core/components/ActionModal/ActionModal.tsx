import * as Haptics from "expo-haptics";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useThemeProvider } from "../../context/ThemeProvider";
import { styles } from "./actionModalStyles";

const teroImage = require("../../assets/images/tero.webp");

interface ActionModalProps {
  message: string;
  leftLabel?: string;
  rightLabel?: string;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export const ActionModal = ({
  message,
  leftLabel = "JA",
  rightLabel = "NEI",
  onLeftClick,
  onRightClick,
}: ActionModalProps) => {
  const { darkMode, theme } = useThemeProvider();
  const bgOverride = darkMode ? { backgroundColor: theme.secondary } : {};
  const textOverride = darkMode ? { color: "#ffffff" } : {};

  const handleLeftPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLeftClick();
  };

  const handleRightPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRightClick();
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, bgOverride]}>
        <Image source={teroImage} style={styles.watermark} resizeMode="contain" />
        <View style={styles.headerRow}>
          <Text style={styles.header}>HEY!</Text>
        </View>
        <Text style={[styles.message, textOverride]}>{message}</Text>
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity onPress={handleLeftPressed} style={styles.button}>
            <Text style={styles.buttonText}>{leftLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRightPressed} style={styles.buttonSecondary}>
            <Text style={styles.buttonSecondaryText}>{rightLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActionModal;
