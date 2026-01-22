import { View, Text, Pressable, Button, Image } from "react-native";
import Screen from "../../../Common/constants/Screen";
import styles from "./homeScreenStyles";
import { useGlobalSessionProvider } from "../../../Common/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import DiagonalSplit from "../../../Common/components/BuzzifyShapes/DiagonalSplit";
import ArcWithCircles from "../../../Common/components/BuzzifyShapes/ArcWithCircles";
import ScatteredCircles from "../../../Common/components/BuzzifyShapes/ScatteredCircles";
import { GameEntryMode } from "@/src/Common/constants/Types";

import redFigure from "../../../Common/assets/images/red-figure.png";
import { useNavigation } from "expo-router";
import { useSpinGameProvider } from "@/src/SpinGame/context/SpinGameProvider";
import { SpinSessionScreen } from "@/src/SpinGame/constants/SpinTypes";

const subHeaderList = [
  "klar for en runde?",
  "la spillet begynne",
  "ta en pause og bli med",
  "vi kjører på",
  "få i gang kvelden",
  "rolige vibber, gode valg",
  "klart for neste?",
];

export const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { commonService, userService } = useServiceProvider();
  const { displayInfoModal } = useModalProvider();
  const { setScreen } = useSpinGameProvider();

  const [subHeader, setSubheader] = useState<string>("");
  const [popupCloseCount, setPopupCloseCount] = useState<number>(0);

  useEffect(() => {
    navigation.navigate(Screen.Spin);
    setScreen(SpinSessionScreen.Game);
  });

  /*
  useEffect(() => {
    setSubHeader();
    systemHealth();
    getClientPopup();
  }, []);
  */

  const getClientPopup = async () => {
    if (popupCloseCount >= 2) {
      console.error("Skipping modal");
      return;
    }

    const result = await userService().getGlobalPopup();
    if (result.isError()) {
      // TODO - add audit
      console.error(result.error);
      return;
    }

    const popup = result.value;
    if (!popup.active) {
      return;
    }

    displayInfoModal(popup.paragraph, popup.heading, () => setPopupCloseCount((prev) => prev + 1));
  };

  const setSubHeader = () => {
    const idx = Math.floor(Math.random() * subHeaderList.length);
    setSubheader(subHeaderList[idx]);
  };

  const systemHealth = async () => {
    const result = await commonService().healthDetailed();
    if (result.isError()) {
      console.error("Failed health, returning error page");
      navigation.navigate(Screen.Error);
    }
  };

  const handlePress = (gameEntryMode: GameEntryMode, destination: Screen) => {
    setGameEntryMode(gameEntryMode);
    navigation.navigate(destination);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leadContainer}>
        <Text style={styles.header}>tero</Text>
        <Text style={styles.subHeader}>{subHeader}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={{ ...styles.buttonBase, ...styles.topLeft }}
          onPress={() => handlePress(GameEntryMode.Creator, Screen.GameTypeList)}
        >
          <Image style={styles.image} source={redFigure} />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textTopLeft }}>LAG</Text>
            <Text style={{ ...styles.textBase, ...styles.textTopLeft }}>SPILL</Text>
          </View>
        </Pressable>
        <Pressable
          style={{ ...styles.buttonBase, ...styles.topRight }}
          onPress={() => handlePress(GameEntryMode.Host, Screen.GameTypeList)}
        >
          <DiagonalSplit />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textTopRight }}>VELG</Text>
            <Text style={{ ...styles.textBase, ...styles.textTopRight }}>SPILL</Text>
          </View>
        </Pressable>
        <Pressable
          style={{ ...styles.buttonBase, ...styles.bottomLeft }}
          onPress={() => navigation.navigate(Screen.Hub)}
        >
          <ArcWithCircles />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textBottomLeft }}>TIL</Text>
            <Text style={{ ...styles.textBase, ...styles.textBottomLeft }}>HUB</Text>
          </View>
        </Pressable>
        <Pressable
          style={{ ...styles.buttonBase, ...styles.bottomRight }}
          onPress={() => handlePress(GameEntryMode.Participant, Screen.Join)}
        >
          <ScatteredCircles />
          <View style={styles.buttonTextWrapper}>
            <View style={styles.textCircle}>
              <Text style={{ ...styles.textBase, ...styles.textBottomRight }}>BLI</Text>
              <Text style={{ ...styles.textBase, ...styles.textBottomRight }}>MED</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
