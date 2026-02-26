import { useRef, useState } from "react";
import { Animated, Pressable, Text } from "react-native";
import { styles } from "./playerCardStyles";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/core/constants/Color";
import * as Haptics from "expo-haptics";

const FILL_DURATION = 800;
const DRAIN_DELAY = 2000;
const DRAIN_DURATION = 600;
const REVERSE_DURATION = 300;

interface PlayerCardProps {
  name: string;
  word: string;
  isImposter: boolean;
  onLocked: () => void;
}

export const PlayerCard = ({ name, word, isImposter, onLocked }: PlayerCardProps) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);
  const [locked, setLocked] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const isCompleted = useRef(false);
  const currentAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const handlePressIn = () => {
    if (locked || cardWidth === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isCompleted.current = false;

    currentAnimation.current = Animated.timing(fillAnim, {
      toValue: cardWidth,
      duration: FILL_DURATION,
      useNativeDriver: false,
    });

    currentAnimation.current.start(({ finished }) => {
      if (!finished) return;
      isCompleted.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRevealed(true);

      setTimeout(() => {
        setRevealed(false);

        setTimeout(() => {
          currentAnimation.current = Animated.timing(fillAnim, {
            toValue: 0,
            duration: DRAIN_DURATION,
            useNativeDriver: false,
          });
          currentAnimation.current.start(() => {
            setLocked(true);
            onLocked();
          });
        }, 300);
      }, DRAIN_DELAY);
    });
  };

  const handlePressOut = () => {
    if (locked || isCompleted.current) return;
    currentAnimation.current?.stop();
    currentAnimation.current = Animated.timing(fillAnim, {
      toValue: 0,
      duration: REVERSE_DURATION,
      useNativeDriver: false,
    });
    currentAnimation.current.start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={locked}
      onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
      style={[styles.playerCard, locked && { opacity: 0.4 }]}
    >
      <Animated.View style={[styles.playerCardFill, { width: fillAnim }]} />
      <Feather name="user" size={28} color={Color.White} />
      <Text
        style={[styles.playerNameText, revealed && (isImposter ? { color: Color.HomeRed } : { color: Color.Green })]}
      >
        {revealed ? (isImposter ? "Imposter" : word) : name}
      </Text>
    </Pressable>
  );
};

export default PlayerCard;
