import { GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { styles } from "./passiveLobbyScreenStyles";

type Props = {
  onLeave: () => void;
};

type CircleProps = {
  size: number;
  style: object;
  delay: number;
  duration: number;
};

const FloatingCircle = ({ size, style, delay, duration }: CircleProps) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -15,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: moderateScale(size),
          height: moderateScale(size),
          borderRadius: moderateScale(size / 2),
          backgroundColor: "rgba(255,255,255,0.12)",
          transform: [{ translateY }],
        },
        style,
      ]}
    />
  );
};

export const PassiveLobbyScreen = ({ onLeave }: Props) => {
  const { sessionData: sessionData, isHost, gameType } = useGlobalSessionProvider();
  const { themeColor, clearSpinSessionValues, players, iterations, setScreen } = useSpinSessionProvider();
  const { disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { commonService } = useServiceProvider();

  const userIconsRef = useRef<string[]>([]);
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [startGameTriggered, setStartGameTriggered] = useState(false);
  const prevPlayersRef = useRef(players);

  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(gameType);

  useEffect(() => {
    fetchUserIcons();
  }, []);

  useEffect(() => {
    if (players > prevPlayersRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevPlayersRef.current = players;
  }, [players]);

  const handleBackPressed = async () => {
    onLeave();
  };

  const fetchUserIcons = () => {
    const icons = commonService().getRandomUserIcons();
    userIconsRef.current = icons;
    setIconsLoaded(true);
  };

  const handleInfoPressed = () => {
    if (isHost) {
      displayInfoModal("Start spillet når alle spillere har blitt med.", "Hva nå?");
    } else {
      displayInfoModal("Venter på at alle spillere blir med i spillet. Verten vil starte når klar.", "Hva nå?");
    }
  };

  const handleStartGame = async () => {
    if (startGameTriggered) {
      return;
    }

    setStartGameTriggered(true);
    if (!isHost) {
      console.error("Only hosts can start a game");
      setStartGameTriggered(false);
      return;
    }

    if (!sessionData.gameKey || sessionData.gameKey == "") {
      displayErrorModal("Mangler spillkode. Lag spillet på nytt.");
      setStartGameTriggered(false);
      return;
    }

    const minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Må ha minst ${minPlayers} spillere for å starte.`);
      setStartGameTriggered(false);
      return;
    }

    if (iterations < 10) {
      displayInfoModal("Minst 10 runder.");
      setStartGameTriggered(false);
      return;
    }

    const startResult = await invokeFunction("StartGame", sessionData.gameKey); // isDraft = false
    if (startResult.isError()) {
      console.error(startResult.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStartGameTriggered(false);
      return;
    }

    const gameReady = startResult.value;
    if (!gameReady) {
      console.debug("Game not ready");
      setStartGameTriggered(false);
      return;
    }

    setScreen(SpinSessionScreen.Game);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <FloatingCircle size={160} delay={0} duration={3200} style={{ top: "4%", left: "-8%" }} />
      <FloatingCircle size={90} delay={500} duration={2800} style={{ top: "10%", right: "-4%" }} />
      <FloatingCircle size={70} delay={200} duration={3600} style={{ top: "40%", left: "4%" }} />
      <FloatingCircle size={120} delay={800} duration={3100} style={{ top: "45%", right: "-5%" }} />
      <FloatingCircle size={55} delay={400} duration={2600} style={{ bottom: "30%", left: "20%" }} />
      <FloatingCircle size={140} delay={100} duration={3400} style={{ bottom: "10%", right: "-6%" }} />

      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <View style={styles.headerInline}>
          <Text style={styles.toastHeader}>Rom:</Text>
          <Text style={styles.headerSecondScreen}>{sessionData.gameKey?.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userIconWrapper}>
          {Array.from({ length: players }).map((_, i) => (
            <Image style={styles.userIcon} key={i} source={{ uri: userIconsRef.current[i] }} />
          ))}
        </View>

        {!isHost && (
          <Text style={{ ...styles.centerText, color: theme.secondaryColor }}>venter på at sjefen starter spillet</Text>
        )}
      </ScrollView>

      {isHost && (
        <TouchableOpacity onPress={handleStartGame} style={styles.stickyButton}>
          <Text style={styles.buttonText}>Start spill</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PassiveLobbyScreen;
