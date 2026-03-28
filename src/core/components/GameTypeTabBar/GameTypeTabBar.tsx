import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import Color from "../../constants/Color";
import { GameType } from "../../constants/Types";
import { moderateScale } from "../../utils/dimensions";
import createStyles from "./gameTypeTabBarStyles";

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  [GameType.Quiz]: "Quiz",
  [GameType.Roulette]: "Rulett",
  [GameType.Duel]: "Duel",
  [GameType.Imposter]: "Imposter",
  [GameType.Dice]: "Terning",
  [GameType.Guess]: "Gjett",
  [GameType.Defuser]: "Defuser",
};

export const GameTypeIcon = ({ type, size, color }: { type: GameType; size: number; color: string }) => {
  switch (type) {
    case GameType.Duel:
      return <MaterialCommunityIcons name="sword-cross" size={size} color={color} />;
    case GameType.Roulette:
      return <FontAwesome6 name="arrows-spin" size={size} color={color} />;
    case GameType.Imposter:
      return <FontAwesome6 name="users" size={size} color={color} solid />;
    case GameType.Quiz:
      return <FontAwesome6 name="layer-group" size={size} color={color} solid />;
    default:
      return <FontAwesome6 name="layer-group" size={size} color={color} solid />;
  }
};

interface GameTypeTabBarProps {
  types: GameType[];
  selectedType: GameType | null;
  onTabPress: (type: GameType) => void;
  showIcons?: boolean;
  activeColor?: string;
  outlined?: boolean;
}

export const GameTypeTabBar = ({
  types,
  selectedType,
  onTabPress,
  showIcons = false,
  activeColor = Color.HomeRed,
  outlined = false,
}: GameTypeTabBarProps) => {
  const styles = createStyles(activeColor, outlined);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabBar}
      contentContainerStyle={styles.tabBarContent}
    >
      {types.map((type) => {
        const isSelected = selectedType === type;
        return (
          <TouchableOpacity
            key={type}
            style={[styles.tab, isSelected && styles.tabSelected]}
            onPress={() => onTabPress(type)}
          >
            {showIcons && (
              <GameTypeIcon type={type} size={moderateScale(18)} color={isSelected ? Color.White : Color.OffBlack} />
            )}
            <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>{GAME_TYPE_LABELS[type]}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default GameTypeTabBar;
