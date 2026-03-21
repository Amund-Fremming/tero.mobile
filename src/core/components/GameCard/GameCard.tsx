import Color from "@/src/core/constants/Color";
import { GameBase, GameCategory } from "@/src/core/constants/Types";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./gameCardStyles";

const CATEGORY_LABELS: Record<GameCategory, string> = {
  [GameCategory.Girls]: "Jentene",
  [GameCategory.Boys]: "Gutta",
  [GameCategory.Mixed]: "Mixed",
  [GameCategory.InnerCircle]: "Indre krets",
};

interface GameCardProps {
  game: GameBase;
  icon: React.ReactNode;
  onPress: () => void;
  saved?: boolean;
  deletable?: boolean;
  onActionPress?: () => void;
}

export const GameCard = ({ game, icon, onPress, saved, deletable, onActionPress }: GameCardProps) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.innerCard}>
          {icon}
          <View style={styles.textWrapper}>
            <Text style={styles.cardCategory}>{CATEGORY_LABELS[game.category]}</Text>
            <Text style={styles.cardHeader}>{game.name}</Text>
            <Text style={styles.cardDescription}>{game.iterations} runder</Text>
          </View>
        </View>
        {deletable && (
          <TouchableOpacity style={styles.actionIcon} onPress={onActionPress}>
            <Feather name="x" size={30} color={Color.Gray} />
          </TouchableOpacity>
        )}
        {!deletable && (
          <TouchableOpacity style={styles.actionIcon} onPress={onActionPress}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={26}
              color={saved ? Color.OffBlack : Color.Gray}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );
};

export default GameCard;
