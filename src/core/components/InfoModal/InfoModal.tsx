import * as Haptics from "expo-haptics";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Color from "../../constants/Color";
import { useThemeProvider } from "../../context/ThemeProvider";
import { styles } from "./infoModalStyles";

const teroImage = require("../../assets/images/tero.webp");

interface InfoModalProps {
  header: string;
  message: string;
  isError: boolean;
  isSuccess: boolean;
  onCloseFunc?: () => void;
}

export const InfoModal = ({ isError, isSuccess, header, message, onCloseFunc }: InfoModalProps) => {
  const { darkMode, theme } = useThemeProvider();
  const headerColor = darkMode ? "#ffffff" : isError ? "#A53F2B" : isSuccess ? "#2D5A27" : "#212529";
  const containerStyle = isError ? styles.errorContainer : isSuccess ? styles.successContainer : styles.infoContainer;
  const bgOverride = darkMode ? { backgroundColor: theme.secondary, borderColor: Color.Black } : {};
  const textOverride = darkMode ? { color: "#ffffff" } : {};
  const buttonStyle = isError ? styles.buttonError : isSuccess ? styles.buttonSuccess : styles.button;

  return (
    <View style={styles.overlay}>
      <View style={[styles.genericContainer, containerStyle, bgOverride]}>
        <Image source={teroImage} style={styles.watermark} resizeMode="contain" />
        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: headerColor }]}>{header}</Text>
        </View>
        <Text style={[styles.message, textOverride]}>{message}</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onCloseFunc && onCloseFunc();
          }}
          style={buttonStyle}
        >
          <Text style={styles.buttonText}>Lukk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InfoModal;
