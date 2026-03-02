import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import { GameEntryMode, GameType } from "../../../core/constants/Types";
import Screen from "../../../core/constants/Screen";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import Color from "../../../core/constants/Color";
import Font from "../../../core/constants/Font";
import { moderateScale, verticalScale } from "../../../core/utils/dimensions";
import { tutorialConfig } from "./tutorialConfig";
import SimpleTutorial from "./components/SimpleTutorial";
import MultiStepTutorial from "./components/MultiStepTutorial";

export const TutorialScreen = () => {
  const navigation: any = useNavigation();
  const { gameType, gameEntryMode, isDraft } = useGlobalSessionProvider();

  const config = tutorialConfig[gameType] ?? tutorialConfig[GameType.Quiz];

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
      <View style={{ flex: 1, backgroundColor: Color.LightGray }}>
        <ScreenHeader
          title="Slik spiller du"
          onBackPressed={() => navigation.goBack()}
          showBorder
          backgroundColor={Color.LightGray}
        />
        <MultiStepTutorial pages={config.pages} onFinish={navigateToGame} onBack={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.LightGray }}>
      <ScreenHeader
        title="Tutorial"
        onBackPressed={() => navigation.goBack()}
        showBorder
        backgroundColor={Color.LightGray}
      />
      <View style={{ flex: 1 }}>
        <SimpleTutorial title={config.title} items={config.items} />
      </View>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigateToGame();
        }}
        style={{
          marginHorizontal: moderateScale(20),
          marginBottom: verticalScale(40),
          backgroundColor: Color.BuzzifyLavender,
          borderRadius: moderateScale(14),
          paddingVertical: verticalScale(16),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: Font.ArchivoBlackRegular,
            fontSize: moderateScale(15),
            color: Color.White,
          }}
        >
          Fortsett
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TutorialScreen;
