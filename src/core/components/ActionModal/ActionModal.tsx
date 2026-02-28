import { Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { styles } from "./actionModalStyles";

interface ActionModalProps {
  message: string;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export const ActionModal = ({ message, onLeftClick, onRightClick }: ActionModalProps) => {
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
      <View style={styles.container}>
        <Text style={styles.header}>Hey</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity onPress={handleLeftPressed} style={styles.button}>
            <Text style={styles.buttonText}>Ja</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRightPressed} style={styles.buttonInverted}>
            <Text style={styles.buttonInvertedText}>Nei</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActionModal;
