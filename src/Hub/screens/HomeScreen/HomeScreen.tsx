import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import ArcWithCircles from "../../../core/components/Shapes/ArcWithCircles";
import DiagonalSplit from "../../../core/components/Shapes/DiagonalSplit";
import ScatteredCircles from "../../../core/components/Shapes/ScatteredCircles";
import Screen from "../../../core/constants/Screen";
import { useGlobalSessionProvider } from "../../../play/context/GlobalSessionProvider";
import { ProblemScreen } from "../ProblemScreen/ProblemScreen";
import { createStyles } from "./homeScreenStyles";

import Color from "@/src/core/constants/Color";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { setStackNavigator } from "@/src/core/utils/navigationRef";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import redFigure from "../../../core/assets/images/red-figure.png";

const subHeaderList = [
  "klar for en runde?",
  "kom i gang med ett ferdig spill",
  "opprett ett spill sammen",
  "få i gang kvelden",
  "kickstart stemingen",
  "klart for neste runde?",
];

export const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId, setPseudoId, ensurePseudoId, accessToken, triggerLogin } = useAuthProvider();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { commonService, userService } = useServiceProvider();
  const { displayInfoModal, displayLoadingModal, closeLoadingModal } = useModalProvider();
  const { darkMode, setDarkMode } = useThemeProvider();
  const styles = createStyles(darkMode);

  const [subHeader, setSubheader] = useState<string>("");
  const [popupCloseCount, setPopupCloseCount] = useState<number>(0);
  const [isPseudoReady, setIsPseudoReady] = useState<boolean>(false);
  const [isSystemDown, setIsSystemDown] = useState<boolean>(false);

  useEffect(() => {
    setStackNavigator(navigation);
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
    }, "Forsøker å koble til");

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
      return;
    }

    const result = await userService().getGlobalPopup();
    if (result.isError()) {
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
    if (result.isError() || !result.value.platform || !result.value.database || !result.value.session) {
      setIsSystemDown(true);
    }
  };

  const handlePress = (gameEntryMode: GameEntryMode, destination: Screen) => {
    if (!isPseudoReady) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGameEntryMode(gameEntryMode);
    navigation.navigate(destination);
  };

  if (isSystemDown) {
    return <ProblemScreen onHealthRestored={() => setIsSystemDown(false)} />;
  }

  const handleProfilePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (accessToken) {
      navigation.navigate(Screen.Profile);
      return;
    }

    triggerLogin();
  };

  const handleToggleDarkmode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggleDarkmode}>
        <Feather
          name={darkMode ? "toggle-left" : "toggle-right"}
          style={{ position: "absolute", left: horizontalScale(60), top: verticalScale(60) }}
          size={moderateScale(45)}
        />
      </Pressable>
      <TouchableOpacity onPress={handleProfilePressed} style={styles.iconWrapper}>
        <Feather size={moderateScale(35)} name="user" color={Color.Black} />
      </TouchableOpacity>
      <View style={styles.leadContainer}>
        <Text style={styles.header}>tero</Text>
        <Text style={styles.subHeader}>{subHeader}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.buttonBase, ...styles.topLeft }}
          disabled={!isPseudoReady}
          onPress={() => handlePress(GameEntryMode.Creator, Screen.GameTypeList)}
        >
          <Image style={styles.image} source={redFigure} />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textTopLeft }}>OPPRETT</Text>
            <Text style={{ ...styles.textBase, ...styles.textTopLeft }}>SPILL</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.buttonBase, ...styles.topRight }}
          disabled={!isPseudoReady}
          onPress={() => handlePress(GameEntryMode.Host, Screen.GameList)}
        >
          <DiagonalSplit />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textTopRight }}>KLARE</Text>
            <Text style={{ ...styles.textBase, ...styles.textTopRight }}>SPILL</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.buttonBase, ...styles.bottomLeft }}
          disabled={!isPseudoReady}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate(Screen.Hub);
          }}
        >
          <ArcWithCircles />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textBottomLeft }}>TIL</Text>
            <Text style={{ ...styles.textBase, ...styles.textBottomLeft }}>HUB</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
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
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
