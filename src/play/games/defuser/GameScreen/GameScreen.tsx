import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { GameType } from "@/src/core/constants/Types";
import { getGameTheme } from "@/src/play/config/gameTheme";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import styles from "./gameScreenStyles";

const WIRE_COLORS = [
  "#eb3d36",
  "#3b82f6",
  "#22c55e",
  "#facc15",
  "#FF6E4A",
  "#a855f7",
  "#e2e8f0",
  "#475569",
  "#92400e",
  "#94a3b8",
  "#06b6d4",
  "#ec4899",
];

const TOTAL_WIRES = WIRE_COLORS.length;
const INITIAL_SECONDS = 90;

type GameState = "playing" | "exploded" | "won";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function GameScreen() {
  const navigation: any = useNavigation();
  const theme = getGameTheme(GameType.Defuser);

  const [triggerIndex, setTriggerIndex] = useState(() => Math.floor(Math.random() * TOTAL_WIRES));
  const [cutWires, setCutWires] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<GameState>("playing");
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);

  const greenOpacity = useRef(new Animated.Value(1)).current;
  const explosionOpacity = useRef(new Animated.Value(0)).current;
  const gameOverOpacity = useRef(new Animated.Value(0)).current;
  const blinkRef = useRef<Animated.CompositeAnimation | null>(null);
  const hasExploded = useRef(false);

  const startBlink = (fast: boolean) => {
    blinkRef.current?.stop();
    const dur = fast ? 180 : 650;
    blinkRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(greenOpacity, { toValue: 0.1, duration: dur, useNativeDriver: true }),
        Animated.timing(greenOpacity, { toValue: 1, duration: dur, useNativeDriver: true }),
      ]),
    );
    blinkRef.current.start();
  };

  useEffect(() => {
    startBlink(false);
    return () => blinkRef.current?.stop();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (seconds === 0 && gameState === "playing") {
      triggerBoom();
    }
  }, [seconds]);

  const triggerBoom = () => {
    if (hasExploded.current) return;
    hasExploded.current = true;
    blinkRef.current?.stop();
    greenOpacity.setValue(0);
    setGameState("exploded");
    // Big repeated vibration burst
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 120);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 240);
    setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 380);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 520);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 640);
    Animated.sequence([
      Animated.timing(explosionOpacity, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(explosionOpacity, { toValue: 0.5, duration: 100, useNativeDriver: true }),
      Animated.timing(explosionOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(explosionOpacity, { toValue: 0.75, duration: 150, useNativeDriver: true }),
      Animated.timing(explosionOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.delay(350),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(explosionOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(gameOverOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleCut = (index: number) => {
    if (gameState !== "playing" || cutWires.has(index)) return;
    if (index === triggerIndex) {
      setCutWires((prev) => new Set(prev).add(index));
      triggerBoom();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const next = new Set(cutWires).add(index);
      setCutWires(next);
      const safeRemaining = TOTAL_WIRES - 1 - next.size;
      startBlink(safeRemaining <= 3);
      if (next.size === TOTAL_WIRES - 1) {
        blinkRef.current?.stop();
        greenOpacity.setValue(1);
        setGameState("won");
      }
    }
  };

  const handleReset = () => {
    blinkRef.current?.stop();
    hasExploded.current = false;
    explosionOpacity.setValue(0);
    gameOverOpacity.setValue(0);
    greenOpacity.setValue(1);
    setTriggerIndex(Math.floor(Math.random() * TOTAL_WIRES));
    setCutWires(new Set());
    setSeconds(INITIAL_SECONDS);
    setGameState("playing");
    startBlink(false);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${pad(mins)}:${pad(secs)}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader title="Defuser" onBackPressed={() => navigation.goBack()} backgroundColor={Color.Red} />

      {/* Bomb panel */}
      <View style={styles.bombPanel}>
        {/* Corner bolts */}
        <View style={[styles.bolt, styles.boltTL]} />
        <View style={[styles.bolt, styles.boltTR]} />
        <View style={[styles.bolt, styles.boltBL]} />
        <View style={[styles.bolt, styles.boltBR]} />

        <View style={styles.clockHousing}>
          <Text style={styles.clockText}>{timeStr}</Text>
        </View>
        <View style={styles.ledRow}>
          <Animated.View style={[styles.led, styles.ledGreen, { opacity: greenOpacity }]} />
          <View style={[styles.led, styles.ledRed, { opacity: gameState === "exploded" ? 1 : 0.15 }]} />
        </View>
        <Text style={styles.armedLabel}>• ARMED •</Text>
      </View>

      {/* Wires - vertical, hanging down from bomb */}
      <View style={styles.wiresArea}>
        {WIRE_COLORS.map((color, i) => {
          const isCut = cutWires.has(i);
          return (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.wireCol, { opacity: pressed ? 0.65 : 1 }]}
              onPress={() => handleCut(i)}
              disabled={isCut || gameState !== "playing"}
            >
              <View style={styles.wireTerm} />
              {isCut ? (
                <>
                  <View style={[styles.wireVertStub, { backgroundColor: color }]}>
                    <View style={styles.wireHighlight} />
                  </View>
                  <View style={styles.wireVertGap} />
                  <View style={[styles.wireVertStub, { backgroundColor: color }]}>
                    <View style={styles.wireHighlight} />
                  </View>
                </>
              ) : (
                <View style={[styles.wireVert, { backgroundColor: color }]}>
                  <View style={styles.wireHighlight} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom terminals row */}
      <View style={styles.wireTermRowBottom}>
        {WIRE_COLORS.map((_, i) => (
          <View key={i} style={styles.wireTermBottomCell}>
            <View style={styles.wireTermBottom} />
          </View>
        ))}
      </View>

      {/* Bottom info plate */}
      <View style={styles.bottomPanel}>
        <Text style={styles.modelPlate}>MODEL: MK-IV DISRUPTOR • S/N: 992-DELTA</Text>
      </View>

      {/* Explosion flash */}
      <Animated.View
        pointerEvents="none"
        style={[styles.fullOverlay, { backgroundColor: "#FF4500", opacity: explosionOpacity }]}
      />

      {/* Game over */}
      {gameState === "exploded" && (
        <Animated.View style={[styles.gameOverOverlay, { opacity: gameOverOpacity }]}>
          <Text style={styles.gameOverTitle}>{"Du sprengte\nbomben!"}</Text>
          <Pressable style={styles.retryBtn} onPress={handleReset}>
            <Text style={[styles.retryBtnText, { fontFamily: Font.PassionOneBold }]}>Prøv igjen</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Win */}
      {gameState === "won" && (
        <View style={[styles.gameOverOverlay, { opacity: 1 }]}>
          <Text style={[styles.gameOverTitle, { color: "#22c55e" }]}>{"Bomben er\ndeaktivert!"}</Text>
          <Pressable style={[styles.retryBtn, { backgroundColor: "#22c55e" }]} onPress={handleReset}>
            <Text style={[styles.retryBtnText, { fontFamily: Font.PassionOneBold }]}>Spill igjen</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default GameScreen;
