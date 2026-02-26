import styles from "./gameTypeListScreenStyles";
import data from "./data.json";
import { View, Text, Pressable, ScrollView, Dimensions, Image } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import Screen from "../../../core/constants/Screen";
import { verticalScale } from "../../../core/utils/dimensions";
import { GameEntryMode, GameType } from "../../../core/constants/Types";
import Color from "../../../core/constants/Color";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";

const { height } = Dimensions.get("window");

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

  const handlePress = (screen: string) => {
    const screenEnum = screen as GameType;
    const creating = gameEntryMode === GameEntryMode.Creator;
    if (creating) {
      setIsDraft(true);
    }
    setGameType(screenEnum);

    const navTarget = creating ? screenEnum : Screen.GameList;
    if (screenEnum == GameType.Duel || screenEnum == GameType.Roulette) {
      navigation.navigate(creating ? "Spin" : Screen.GameList);
      return;
    }
    if (screenEnum == GameType.Dice) {
      navigation.navigate(GameType.Dice);
      return;
    }
    navigation.navigate(navTarget);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          height: height,
        }}
        contentContainerStyle={{
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          gap: verticalScale(15),
          paddingBottom: verticalScale(200),
        }}
      >
        <ScreenHeader
          title={gameEntryMode === GameEntryMode.Creator ? "Lag spill" : "Velg type"}
          onBackPressed={() => navigation.goBack()}
          onInfoPress={handleInfoPressed}
          showBorder={true}
          backgroundColor={Color.LightGray}
        />
        {data &&
          data.map((item, index) => (
            <Pressable key={index} style={styles.card} onPress={() => handlePress(item.screen)}>
              <Image source={iconMap[item.icon]} style={styles.cardImage} />
              <Text style={{ ...styles.cardHeader, color: item.color }}>{item.name}</Text>
            </Pressable>
          ))}
        <Pressable key={100} style={styles.card} onPress={() => navigation.navigate(Screen.TipsUs)}>
          <Image source={require("../../../core/assets/images/finger.jpg")} style={styles.cardImage} />
          <Text style={{ ...styles.cardHeader, color: Color.White }}>Ditt spill?</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default GameTypeListScreen;
