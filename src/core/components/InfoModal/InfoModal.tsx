import * as Haptics from "expo-haptics";
import { Image, Text, TouchableOpacity, View } from "react-native";
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
  const headerColor = isError ? "#A53F2B" : isSuccess ? "#2D5A27" : "#212529";
  const containerStyle = isError ? styles.errorContainer : isSuccess ? styles.successContainer : styles.infoContainer;
  const buttonStyle = isError ? styles.buttonError : isSuccess ? styles.buttonSuccess : styles.button;

  return (
    <View style={styles.overlay}>
      <View style={[styles.genericContainer, containerStyle]}>
        <Image source={teroImage} style={styles.watermark} resizeMode="contain" />
        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: headerColor }]}>{header}</Text>
          <Image source={teroImage} style={styles.headerIcon} resizeMode="contain" />
        </View>
        <Text style={styles.message}>{message}</Text>
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
