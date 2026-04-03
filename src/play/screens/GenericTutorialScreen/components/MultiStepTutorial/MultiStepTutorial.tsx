import Color from "@/src/core/constants/Color";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./multiStepTutorialStyles";

const DOT_SIZE = moderateScale(8);

interface MultiStepTutorialProps {
  pages: React.ComponentType[];
  onFinish: () => void;
  onBack: () => void;
  accentColor?: string;
  lastButtonText?: string;
}

export const MultiStepTutorial = ({
  pages,
  onFinish,
  onBack,
  accentColor = Color.BuzzifyLavender,
  lastButtonText = "Fortsett",
}: MultiStepTutorialProps) => {
  const { darkMode, theme } = useThemeProvider();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLast = currentIndex === pages.length - 1;
  const CurrentPage = pages[currentIndex];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLast) {
      onFinish();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageWrapper}>
        <CurrentPage />
      </View>

      <View style={styles.dotRow}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: accentColor },
              { width: i === currentIndex ? DOT_SIZE * 3 : DOT_SIZE, opacity: i === currentIndex ? 1 : 0.35 },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={[styles.buttonText, { color: darkMode ? theme.secondary : Color.White }]}>Tilbake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: accentColor }]}>
          <Text style={[styles.buttonText, { color: darkMode ? theme.secondary : Color.White }]}>{isLast ? lastButtonText : "Neste"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MultiStepTutorial;
