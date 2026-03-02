import React from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "./simpleTutorialStyles";

interface SimpleTutorialProps {
  title?: string;
  items: string[];
}

export const SimpleTutorial = ({ title, items }: SimpleTutorialProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {title && <Text style={styles.title}>{title}</Text>}

      {items.map((text, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{i + 1}</Text>
          </View>
          <Text style={styles.itemText}>{text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SimpleTutorial;
