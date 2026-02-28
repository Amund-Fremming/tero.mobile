import { Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import styles from "./gameCardStyles";
import { GameBase } from "@/src/core/constants/Types";

interface GameBaseCardProps {
  gameBase: GameBase;
  handlePress: () => void;
}

export const GameCard = ({ gameBase, handlePress }: GameBaseCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handlePress();
      }}
    >
      <Text style={styles.header}>{gameBase.name}</Text>
      <Text style={styles.iterations}>{gameBase.iterations}</Text>
    </TouchableOpacity>
  );
};

export default GameCard;
