import { tutorialConfig } from "@/src/core/config/tutorialConfig";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import { GameEntryMode, GameType } from "../../../core/constants/Types";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import MultiStepTutorial from "./components/MultiStepTutorial/MultiStepTutorial";
import SimpleTutorial from "./components/SimpleTutorial/SimpleTutorial";
import styles from "./tutorialScreenStyles";

interface GenericTutorialScreenRouteProps {
  onFinishedPressed: () => void;
}

export const GenericTutorialScreen = ({ onFinishedPressed }: GenericTutorialScreenRouteProps) => {
  const navigation: any = useNavigation();
  const { gameType, gameEntryMode } = useGlobalSessionProvider();
  const { getGameTheme } = useThemeProvider();

  const config = tutorialConfig[gameType] ?? tutorialConfig[GameType.Quiz];
  const theme = getGameTheme(gameType);

  const getLastButtonText = (): string => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return "Opprett spill";
      case GameEntryMode.Host:
        return "Neste";
      default:
        return "Neste";
    }
  };

  if (config.mode === "multi") {
    return (
      <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
        <ScreenHeader
          title="Tutorial"
          onBackPressed={() => navigation.goBack()}
          showBorder
          backgroundColor={theme.primaryColor}
        />
        <MultiStepTutorial
          pages={config.pages}
          onFinish={onFinishedPressed}
          onBack={() => navigation.goBack()}
          accentColor={theme.secondaryColor}
          lastButtonText={getLastButtonText()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader
        title="Tutorial"
        onBackPressed={() => navigation.goBack()}
        showBorder
        backgroundColor={theme.primaryColor}
      />
      <View style={styles.content}>
        <SimpleTutorial title={config.title} items={config.items} accentColor={theme.secondaryColor} />
      </View>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onFinishedPressed();
        }}
        style={[styles.continueButton, { backgroundColor: theme.secondaryColor }]}
      >
        <Text style={styles.continueText}>{getLastButtonText()}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenericTutorialScreen;
