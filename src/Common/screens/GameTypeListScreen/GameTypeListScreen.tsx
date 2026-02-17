import styles from "./gameTypeListScreenStyles";
import data from "./data.json";
import { View, Text, Pressable, ScrollView, Dimensions, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import Screen from "../../constants/Screen";
import { moderateScale, verticalScale } from "../../utils/dimensions";
import { Feather } from "@expo/vector-icons";
import { GameEntryMode, GameType } from "../../constants/Types";
import Color from "../../constants/Color";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";

const { height } = Dimensions.get("window");

export const GameTypeListScreen = () => {
  const navigation: any = useNavigation();
  const { setGameType, gameEntryMode } = useGlobalSessionProvider();

  const handlePress = (screen: string) => {
    const screenEnum = screen as GameType;
    const creating = gameEntryMode === GameEntryMode.Creator;
    setGameType(screenEnum);

    const navTarget = creating ? screenEnum : Screen.GameList;
    if (screenEnum == GameType.Duel || screenEnum == GameType.Roulette) {
      navigation.navigate(creating ? "Spin" : Screen.GameList);
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
              <View style={styles.imagePlaceholder}></View>
              <Text style={styles.cardHeader}>{item.name}</Text>
            </Pressable>
          ))}
        <Pressable key={100} style={styles.card} onPress={() => navigation.navigate(Screen.TipsUs)}>
          <View style={styles.imagePlaceholder}></View>
          <Text style={styles.cardHeader}>Ditt spill?</Text>
          <Text style={styles.cardSubheader}>Send inn forslag til nye spill</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default GameTypeListScreen;
