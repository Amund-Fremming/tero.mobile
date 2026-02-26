import { Text, Pressable } from "react-native";
import styles from "./gameCardStyles";
import { useNavigation } from "@react-navigation/native";
import { GameBase } from "@/src/core/constants/Types";

interface GameBaseCardProps {
  gameBase: GameBase;
  handlePress: () => void;
}

export const GameCard = ({ gameBase, handlePress }: GameBaseCardProps) => {
  const navigation: any = useNavigation();

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Text style={styles.header}>{gameBase.name}</Text>
      <Text style={styles.iterations}>{gameBase.iterations}</Text>
    </Pressable>
  );
};

export default GameCard;
