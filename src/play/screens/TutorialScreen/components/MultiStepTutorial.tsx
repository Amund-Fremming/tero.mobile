import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { moderateScale } from "../../../../core/utils/dimensions";
import styles from "./multiStepTutorialStyles";

const DOT_SIZE = moderateScale(8);

interface MultiStepTutorialProps {
  pages: React.ComponentType[];
  onFinish: () => void;
  onBack: () => void;
}

export const MultiStepTutorial = ({ pages, onFinish, onBack }: MultiStepTutorialProps) => {
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
              { width: i === currentIndex ? DOT_SIZE * 3 : DOT_SIZE, opacity: i === currentIndex ? 1 : 0.35 },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.buttonText}>Tilbake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.buttonText}>{isLast ? "Fortsett" : "Neste"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MultiStepTutorial;
