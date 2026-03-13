import { useModalProvider } from "@/src/core/context/ModalProvider";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import Color from "../../../core/constants/Color";
import Screen from "../../../core/constants/Screen";
import { GameEntryMode, GameType } from "../../../core/constants/Types";
import { verticalScale } from "../../../core/utils/dimensions";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import data from "./data.json";
import styles from "./gameTypeListScreenStyles";

const iconMap: { [key: string]: any } = {
  "quiz.webp": require("../../../core/assets/images/quiz.webp"),
  "roulette.webp": require("../../../core/assets/images/roulette.webp"),
  "duel.webp": require("../../../core/assets/images/duel.webp"),
  "imposter.webp": require("../../../core/assets/images/imposter.webp"),
  "dice.webp": require("../../../core/assets/images/dice.webp"),
};

export const GameTypeListScreen = () => {
  const navigation: any = useNavigation();
  const { setGameType, gameEntryMode, setIsDraft } = useGlobalSessionProvider();
  const { displayInfoModal } = useModalProvider();
  const isCreating = gameEntryMode === GameEntryMode.Creator;

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
    displayInfoModal("For å opprette ett spill må du først velge hvilken type spill du vil lage.", "Hvordan?");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={gameEntryMode === GameEntryMode.Creator ? "Nytt spill" : "Klare spill"}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
        showBorder={true}
        backgroundColor={gameEntryMode === GameEntryMode.Creator ? Color.HomeRed : Color.Purple}
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
              style={[styles.card, { borderColor: isCreating ? Color.Gray : Color.BuzzifyLightBeige }]}
              onPress={() => handlePress(item.screen)}
            >
              <Image source={iconMap[item.icon]} style={styles.cardImage} />
              <View style={[styles.modeBadge, { backgroundColor: isCreating ? Color.HomeRed : Color.Purple }]}>
                <Text style={styles.modeBadgeText}>{isCreating ? "LAG" : "SPILL"}</Text>
              </View>
              <Text style={{ ...styles.cardHeader, color: item.color }}>{item.name}</Text>
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
