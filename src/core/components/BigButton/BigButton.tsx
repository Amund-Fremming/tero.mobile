import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./bigButtonStyles";

interface BigButtonProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
}

export const BigButton = ({ label, backgroundColor, textColor, onPress }: BigButtonProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};
