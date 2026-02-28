import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Dimensions } from "react-native";
import { Color } from "@/src/core/constants/Color";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

interface Props {
  onFinish: () => void;
}

function wiggleWalk(x: Animated.Value, y: Animated.Value, toX: number, duration: number) {
  const wiggleCount = 6;
  const wiggleAmplitude = 18;
  const wiggleDuration = duration / wiggleCount;

  const xAnim = Animated.timing(x, {
    toValue: toX,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  const yWiggle = Animated.loop(
    Animated.sequence([
      Animated.timing(y, {
        toValue: -wiggleAmplitude,
        duration: wiggleDuration / 2,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(y, {
        toValue: wiggleAmplitude,
        duration: wiggleDuration / 2,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]),
    { iterations: wiggleCount },
  );

  return Animated.parallel([xAnim, yWiggle]);
}

export default function SplashScreen({ onFinish }: Props) {
  const x = useRef(new Animated.Value(width)).current;
  const y = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const landingThud = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 80);

    // Small squash-and-stretch on landing
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    // Trigger landing haptic/squash exactly when bird reaches center
    const landingTimer = setTimeout(landingThud, 800);

    // After pause, exit to the left, then fade the background out
    const exitTimer = setTimeout(() => {
      wiggleWalk(x, y, -width, 700).start(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(onFinish);
      });
    }, 800 + 600);

    wiggleWalk(x, y, 0, 800).start();

    return () => {
      clearTimeout(landingTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.Image
        source={require("@/src/core/assets/images/tero.webp")}
        style={[styles.mascot, { transform: [{ translateX: x }, { translateY: y }, { scale }] }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: Color.BuzzifyLavender,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  mascot: {
    width: width * 0.55,
    height: width * 0.55,
  },
});
