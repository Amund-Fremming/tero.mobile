import Color from "@/src/core/constants/Color";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "./simpleTutorialStyles";

interface SimpleTutorialProps {
  title?: string;
  items: (string | React.ReactNode)[];
  accentColor?: string;
}

export const SimpleTutorial = ({ title, items, accentColor = Color.BuzzifyLavender }: SimpleTutorialProps) => {
  const { darkMode, theme } = useThemeProvider();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {title && <Text style={styles.title}>{title}</Text>}

      {items.map((text, i) => (
        <View key={i} style={[styles.card, { backgroundColor: darkMode ? theme.secondary : Color.White }]}>
          <View style={[styles.badge, { borderColor: accentColor }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{i + 1}</Text>
          </View>
          <Text style={styles.itemText}>{text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SimpleTutorial;
