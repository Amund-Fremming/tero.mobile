import styles from "./gameTypeListScreenStyles";
import data from "./data.json";
import { View, Text, Pressable, ScrollView, Dimensions, Image } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { useGlobalGameProvider } from "../../context/GlobalGameProvider";
import Screen from "../../constants/Screen";
import { verticalScale } from "../../utils/dimensions";
import { Feather } from "@expo/vector-icons";
import Color from "../../constants/Color";
import { GameEntryMode, GameType } from "../../constants/Types";

const { height } = Dimensions.get("window");

export const GameTypeListScreen = () => {
  const navigation: any = useNavigation();
  const { setGameType, gameEntryMode } = useGlobalGameProvider();

  const handlePress = (screen: string) => {
    console.log("SCREEN: ", screen);
    const screenEnum = screen as GameType;
    const creating = gameEntryMode === GameEntryMode.Creator;
    setGameType(screenEnum);

    const navTarget = creating ? screenEnum : Screen.GameList;
    console.log("Navigating to:", navTarget, "creating:", creating);
    navigation.navigate(navTarget);
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
        <View style={styles.topWrapper}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconWrapper}>
            <Feather name="chevron-left" size={32} color={Color.OffBlack} />
          </Pressable>
          <View>
            <Text style={styles.header}>{gameEntryMode === GameEntryMode.Creator ? "Lag spill" : "Velg spill"}</Text>
            <View style={styles.borderWrapper}>
              <View style={styles.borderLeft} />
              <View style={styles.borderRight} />
            </View>
          </View>
          <Pressable style={styles.iconWrapper}>
            <Text style={styles.icon}>?</Text>
          </Pressable>
        </View>
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
