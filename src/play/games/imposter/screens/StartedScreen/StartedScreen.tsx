import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { GameType } from "@/src/core/constants/Types";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./startedScreenStyles";

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
          backgroundColor: "rgba(255,255,255,0.15)",
          transform: [{ translateY }],
        },
        style,
      ]}
    />
  );
};

export const StartedScreen = () => {
  const navigation: any = useNavigation();

  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues } = useImposterSessionProvider();
  const { disconnect } = useHubConnectionProvider();

  const handleLeave = () => {
    resetToHomeScreen(navigation);
    clearImposterSessionValues();
    disconnect();
  };

  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(GameType.Imposter);

  return (
    <View style={{ ...styles.container, backgroundColor: theme.primaryColor }}>
      <ScreenHeader title="" onBackPressed={handleLeave} />

      <FloatingCircle size={180} delay={0} duration={3200} style={{ top: "5%", left: "-8%" }} />
      <FloatingCircle size={100} delay={600} duration={2800} style={{ top: "12%", right: "-4%" }} />
      <FloatingCircle size={70} delay={200} duration={3600} style={{ top: "38%", left: "6%" }} />
      <FloatingCircle size={130} delay={800} duration={3100} style={{ top: "42%", right: "-5%" }} />
      <FloatingCircle size={90} delay={400} duration={2600} style={{ bottom: "28%", left: "25%" }} />
      <FloatingCircle size={155} delay={100} duration={3400} style={{ bottom: "8%", right: "-6%" }} />
      <FloatingCircle size={55} delay={700} duration={2900} style={{ bottom: "18%", left: "8%" }} />

      <View style={styles.textBox}>
        <Text style={{ ...styles.header, color: Color.White }}>Spillet har startet!</Text>
        <Text style={styles.subHeader}>
          Du kan legge vekk telefonen, spillet vil bli spilt videre på en annen telefon
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLeave}>
        <Text style={styles.buttonText}>Hjem</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartedScreen;
