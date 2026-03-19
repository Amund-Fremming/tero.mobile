import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useSpinSessionProvider } from "@/src/play/games/spinGame/context/SpinGameProvider";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import styles from "./finishedScreenStyles";

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
          backgroundColor: "rgba(255,255,255,0.15)",
          transform: [{ translateY }],
        },
        style,
      ]}
    />
  );
};

const FinishedScreen = ({ onLeave }: Props) => {
  const { themeColor } = useSpinSessionProvider();
  const textScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(textScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.05,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <ScreenHeader title="" onBackPressed={onLeave} />

      <FloatingCircle size={180} delay={0} duration={3200} style={{ top: "5%", left: "-8%" }} />
      <FloatingCircle size={100} delay={600} duration={2800} style={{ top: "12%", right: "-4%" }} />
      <FloatingCircle size={70} delay={200} duration={3600} style={{ top: "38%", left: "6%" }} />
      <FloatingCircle size={130} delay={800} duration={3100} style={{ top: "42%", right: "-5%" }} />
      <FloatingCircle size={90} delay={400} duration={2600} style={{ bottom: "28%", left: "25%" }} />
      <FloatingCircle size={155} delay={100} duration={3400} style={{ bottom: "8%", right: "-6%" }} />
      <FloatingCircle size={55} delay={700} duration={2900} style={{ bottom: "18%", left: "8%" }} />

      <Animated.Text style={[styles.text, { opacity: textOpacity, transform: [{ scale: textScale }] }]}>
        Spillet er ferdig!
      </Animated.Text>

      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity style={styles.button} onPress={onLeave}>
          <Text style={styles.buttonText}>Hjem</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default FinishedScreen;
