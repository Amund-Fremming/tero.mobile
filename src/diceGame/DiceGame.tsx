import { Text, View, TouchableOpacity, Animated } from "react-native";
import { styles } from "./diceGameStyles";
import ScreenHeader from "../common/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { useState, useRef } from "react";
import Color from "../common/constants/Color";

const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export const DiceGame = () => {
  const navigation: any = useNavigation();
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleInfoPressed = () => {
    //
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);

    // Animation sequence
    Animated.sequence([
      // Shake and rotate
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Reset rotation
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRolling(false);
    });

    // Change dice value rapidly during animation
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
      }
    }, 50);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Terning"
        backgroundColor={Color.LightGray}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Trykk på terningen!</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={rollDice} disabled={isRolling} style={styles.diceContainer}>
          <Animated.View
            style={[
              styles.dice,
              {
                transform: [{ rotate: spin }, { scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.diceEmoji}>{diceEmojis[diceValue - 1]}</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Resultat</Text>
          <Text style={styles.resultValue}>{diceValue}</Text>
        </View>

        <Text style={styles.hint}>{isRolling ? "Kaster..." : "Trykk for å kaste terningen"}</Text>
      </View>
    </View>
  );
};

export default DiceGame;
