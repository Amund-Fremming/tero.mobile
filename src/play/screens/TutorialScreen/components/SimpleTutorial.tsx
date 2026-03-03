import Color from "@/src/core/constants/Color";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "./simpleTutorialStyles";

interface SimpleTutorialProps {
  title?: string;
  items: string[];
  accentColor?: string;
}

export const SimpleTutorial = ({ title, items, accentColor = Color.BuzzifyLavender }: SimpleTutorialProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {title && <Text style={[styles.title, { color: accentColor }]}>{title}</Text>}

      {items.map((text, i) => (
        <View key={i} style={styles.card}>
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
