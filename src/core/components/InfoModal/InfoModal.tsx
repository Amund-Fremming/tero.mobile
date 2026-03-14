import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./infoModalStyles";

interface InfoModalProps {
  header: string;
  message: string;
  isError: boolean;
  isSuccess: boolean;
  onCloseFunc?: () => void;
}

export const InfoModal = ({ isError, isSuccess, header, message, onCloseFunc }: InfoModalProps) => {
  const headerColor = isError ? "#B74837" : isSuccess ? "#236E58" : "#3B6282";

  return (
    <View style={styles.overlay}>
      <View style={[styles.genericContainer, isError ? styles.errorContainer : styles.messageContainer]}>
        <Text style={{ ...styles.header, color: headerColor }}>{header}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onCloseFunc && onCloseFunc();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Lukk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InfoModal;
