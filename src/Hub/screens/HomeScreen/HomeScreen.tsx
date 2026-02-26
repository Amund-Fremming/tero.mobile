import { View, Text, Pressable, Image } from "react-native";
import Screen from "../../../core/constants/Screen";
import styles from "./homeScreenStyles";
import { useGlobalSessionProvider } from "../../../play/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import DiagonalSplit from "../../../core/components/Shapes/DiagonalSplit";
import ArcWithCircles from "../../../core/components/Shapes/ArcWithCircles";
import ScatteredCircles from "../../../core/components/Shapes/ScatteredCircles";
import { GameEntryMode } from "@/src/core/constants/Types";
import * as SecureStore from "expo-secure-store";

import redFigure from "../../../core/assets/images/red-figure.png";
import { useNavigation } from "expo-router";

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
  const { pseudoId, setPseudoId, ensurePseudoId } = useAuthProvider();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { commonService, userService } = useServiceProvider();
  const { displayInfoModal, displayLoadingModal, closeLoadingModal } = useModalProvider();

  const [subHeader, setSubheader] = useState<string>("");
  const [popupCloseCount, setPopupCloseCount] = useState<number>(0);
  const [isPseudoReady, setIsPseudoReady] = useState<boolean>(false);

  useEffect(() => {
    setSubHeader();
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    const success = await ensurePseudoIdReady();
    if (!success) {
      return;
    }

    await systemHealth();
    await getClientPopup();
  };

  const ensurePseudoIdReady = async (): Promise<boolean> => {
    if (pseudoId !== "") {
      setIsPseudoReady(true);
      return true;
    }

    const maxAttempts = 5;
    const baseDelay = 1000;
    displayLoadingModal(() => {
      closeLoadingModal();
      navigation.navigate(Screen.Problem);
    }, "Trying to reconnect.");

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await ensurePseudoId();

      if (!result.isError() && result.value !== "") {
        setPseudoId(result.value);
        await SecureStore.setItemAsync("pseudo_id", result.value);
        closeLoadingModal();
        setIsPseudoReady(true);
        return true;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    closeLoadingModal();
    navigation.navigate(Screen.Problem);
    return false;
  };

  const getClientPopup = async () => {
    if (popupCloseCount >= 2) {
      console.debug("Skipping modal");
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
    if (!isPseudoReady) {
      return;
    }

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
          disabled={!isPseudoReady}
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
          disabled={!isPseudoReady}
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
          disabled={!isPseudoReady}
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
          disabled={!isPseudoReady}
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
