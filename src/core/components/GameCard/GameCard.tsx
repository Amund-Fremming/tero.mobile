import Color from "@/src/core/constants/Color";
import { GameBase, GameCategory } from "@/src/core/constants/Types";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
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
  const { theme, darkMode } = useThemeProvider();
  const categoryColor = darkMode ? Color.HomeRed : Color.Burgunde;
  const headerColor = darkMode ? Color.White : Color.OffBlack;
  const bookmarkActiveColor = darkMode ? Color.White : Color.OffBlack;

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.innerCard}>
          {icon}
          <View style={styles.textWrapper}>
            <Text style={[styles.cardCategory, { color: categoryColor }]}>
              {game.game_type} • {CATEGORY_LABELS[game.category]}
            </Text>
            <Text style={[styles.cardHeader, { color: headerColor }]}>{game.name}</Text>
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
              color={saved ? bookmarkActiveColor : Color.Gray}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <View style={[styles.separator, { backgroundColor: theme.secondary }]} />
    </>
  );
};

export default GameCard;
