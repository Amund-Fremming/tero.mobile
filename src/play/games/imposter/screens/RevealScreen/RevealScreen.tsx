import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./revealScreenStyles";

type Props = {
  onLeave: () => void;
};

export const RevealScreen = ({ onLeave }: Props) => {
  const navigation: any = useNavigation();
  const { gameEntryMode } = useGlobalSessionProvider();
  const { imposterName, imposterSession, setScreen } = useImposterSessionProvider();
  const { displayInfoModal } = useModalProvider();

  const [revealed, setRevealed] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const theme = getGameTheme(GameType.Imposter);
  const hasMoreRounds = (imposterSession?.currentIteration ?? 0) < (imposterSession?.rounds?.length ?? 0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const mysteryOpacity = useRef(new Animated.Value(1)).current;
  const mysteryScale = useRef(new Animated.Value(1)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.3)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const sway = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    sway.start();

    return () => {
      pulse.stop();
      sway.stop();
    };
  }, []);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.timing(mysteryOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(mysteryScale, {
        toValue: 1.5,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.spring(revealScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(revealOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          setButtonVisible(true);
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 1000);
      });
    });
  };

  const handleInfoPressed = () => {
    displayInfoModal(
      "Når dere er ferdige med runden kan dere trykke her for å avsløre hvem som var imposteren.",
      "Avsløring",
    );
  };

  const handleNext = () => {
    if (hasMoreRounds) {
      setScreen(ImposterSessionScreen.Roles);
      return;
    }

    if (gameEntryMode === GameEntryMode.Creator) {
      setScreen(ImposterSessionScreen.Create);
      return;
    }

    resetToHomeScreen(navigation);
  };

  const rotate = swayAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-12deg", "0deg", "12deg"],
  });

  return (
    <View style={{ ...styles.container, backgroundColor: theme.primaryColor }}>
      <ScreenHeader title="Avsløring" onBackPressed={onLeave} onInfoPress={handleInfoPressed} />

      <View style={styles.centerContent}>
        <TouchableOpacity onPress={handleReveal} disabled={revealed}>
          <Animated.View
            style={[
              styles.mysteryCard,
              {
                opacity: mysteryOpacity,
                transform: [{ scale: Animated.multiply(pulseAnim, mysteryScale) }, { rotate }],
              },
            ]}
          >
            <Text style={styles.questionMark}>?</Text>
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.revealCard,
            {
              opacity: revealOpacity,
              transform: [{ scale: revealScale }],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.imposterLabel}>IMPOSTEREN ER</Text>
          <Text style={styles.imposterName}>{imposterName}</Text>
        </Animated.View>
      </View>

      <View style={styles.buttonsWrapper}>
        <Animated.View style={[{ width: "100%", alignItems: "center" }, { opacity: buttonOpacity }]}>
          {buttonVisible && (
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.nextButton, !hasMoreRounds && styles.nextButtonFinish]}
            >
              <Text style={styles.buttonText}>{hasMoreRounds ? "Neste runde" : "Avslutt spillet"}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default RevealScreen;
