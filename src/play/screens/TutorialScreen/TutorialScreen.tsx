import { getGameTheme } from "@/src/play/config/gameTheme";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import Screen from "../../../core/constants/Screen";
import { GameEntryMode, GameType } from "../../../core/constants/Types";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import MultiStepTutorial from "./components/MultiStepTutorial";
import SimpleTutorial from "./components/SimpleTutorial";
import { tutorialConfig } from "./tutorialConfig";
import styles from "./tutorialScreenStyles";

export const TutorialScreen = () => {
  const navigation: any = useNavigation();
  const { gameType, gameEntryMode, isDraft } = useGlobalSessionProvider();

  const config = tutorialConfig[gameType] ?? tutorialConfig[GameType.Quiz];
  const theme = getGameTheme(gameType);

  const navigateToGame = () => {
    const creating = isDraft || gameEntryMode === GameEntryMode.Creator;
    if (gameType === GameType.Duel || gameType === GameType.Roulette) {
      navigation.navigate(creating ? Screen.Spin : Screen.GameList);
      return;
    }

    if (gameType === GameType.Dice) {
      navigation.navigate(Screen.Dice);
      return;
    }

    navigation.navigate(creating ? gameType : Screen.GameList);
  };

  if (config.mode === "multi") {
    return (
      <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
        <ScreenHeader
          title="Slik spiller du"
          onBackPressed={() => navigation.goBack()}
          showBorder
          backgroundColor={theme.primaryColor}
        />
        <MultiStepTutorial
          pages={config.pages}
          onFinish={navigateToGame}
          onBack={() => navigation.goBack()}
          accentColor={theme.secondaryColor}
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
          navigateToGame();
        }}
        style={[styles.continueButton, { backgroundColor: theme.secondaryColor }]}
      >
        <Text style={styles.continueText}>Fortsett</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TutorialScreen;
