import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import Color from "../../../core/constants/Color";
import Screen from "../../../core/constants/Screen";
import { GameEntryMode, GameType } from "../../../core/constants/Types";
import { verticalScale } from "../../../core/utils/dimensions";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import data from "./data.json";
import styles from "./gameTypeListScreenStyles";

interface Theme {
  bg: String;
  cardBorder: String;
}

const iconMap: { [key: string]: any } = {
  "quiz.webp": require("../../../core/assets/images/quiz.webp"),
  "roulette.webp": require("../../../core/assets/images/roulette.webp"),
  "duel.webp": require("../../../core/assets/images/duel.webp"),
  "imposter.webp": require("../../../core/assets/images/imposter.webp"),
  "dice.webp": require("../../../core/assets/images/dice.webp"),
  "guess.webp": require("../../../core/assets/images/guess.webp"),
  "defuser.webp": require("../../../core/assets/images/defuser.webp"),
};

export const GameTypeListScreen = () => {
  const navigation: any = useNavigation();

  const { darkMode } = useThemeProvider();
  const { setGameType, gameEntryMode, setIsDraft } = useGlobalSessionProvider();
  const { displayInfoModal } = useModalProvider();
  const isCreating = gameEntryMode === GameEntryMode.Creator;
  const totalCards = data.length + (isCreating ? 1 : 0);
  const needsSpacer = totalCards % 2 !== 0;

  const [theme, _] = useState(() => {
    if (darkMode) {
      return {
        bg: Color.Black,
        cardBorder: Color.OffBlack,
      };
    }

    return {
      bg: Color.White,
      cardBorder: Color.Gray,
    };
  });

  const handlePress = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const screenEnum = screen as GameType;
    setGameType(screenEnum);

    if (isCreating) {
      setIsDraft(true);
      if (screenEnum === GameType.Duel || screenEnum === GameType.Roulette) {
        navigation.navigate(Screen.Spin);
        return;
      }

      if (screenEnum === GameType.Dice) {
        navigation.navigate(Screen.Dice);
        return;
      }

      navigation.navigate(screenEnum);
      return;
    }

    navigation.navigate(Screen.GameList);
  };

  const handleInfoPressed = () => {
    displayInfoModal("For å opprette ett spill må du først velge hvilken type spill du vil lage.", "Velg type");
  };

  return (
    <View style={{ ...styles.container, backgroundColor: theme.bg }}>
      <View style={styles.bgDecorations} pointerEvents="none">
        <View
          style={[
            styles.bgDiamond,
            { width: 260, height: 260, top: -130, left: -130, backgroundColor: Color.BuzzifyLavender },
          ]}
        />
        <View
          style={[styles.bgDiamond, { width: 160, height: 160, top: 180, right: -100, backgroundColor: Color.HomeRed }]}
        />
        <View
          style={[styles.bgDiamond, { width: 200, height: 200, top: 400, left: -80, backgroundColor: Color.Purple }]}
        />
        <View
          style={[
            styles.bgDiamond,
            { width: 140, height: 140, bottom: 100, right: -60, backgroundColor: Color.BuzzifyLavender },
          ]}
        />
      </View>
      <ScreenHeader
        title={gameEntryMode === GameEntryMode.Creator ? "Nytt spill" : "Klare spill"}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
        showBorder={true}
        backgroundColor={Color.BuzzifyLavender}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        style={{
          paddingTop: verticalScale(15),
          width: "100%",
          backgroundColor: "transparent",
        }}
        contentContainerStyle={{
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          gap: verticalScale(15),
          paddingBottom: verticalScale(20),
        }}
      >
        {data &&
          data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{ ...styles.card, borderColor: theme.cardBorder }}
              onPress={() => handlePress(item.screen)}
            >
              <Image source={iconMap[item.icon]} style={styles.cardImage} />
              <View style={styles.modeBadge}>
                <Text style={styles.modeBadgeText}>LAG</Text>
              </View>
              <Text style={styles.cardHeader}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        <TouchableOpacity
          key={100}
          style={styles.card}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate(Screen.TipsUs);
          }}
        >
          <Image source={require("../../../core/assets/images/finger.jpg")} style={styles.cardImage} />
          <Text style={{ ...styles.cardHeader, color: Color.White }}>Ditt spill?</Text>
        </TouchableOpacity>
        {needsSpacer && <View style={styles.cardSpacer} />}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>Flere spill på vei!</Text>
          <View style={styles.footerDivider} />
        </View>
      </ScrollView>
    </View>
  );
};

export default GameTypeListScreen;
