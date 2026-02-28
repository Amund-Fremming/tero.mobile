import { View, Text, ScrollView, Animated, TouchableOpacity } from "react-native";
import styles from "./rolesScreenStyles";
import { useEffect, useRef, useState } from "react";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useNavigation } from "expo-router";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { resetToHomeScreen } from "@/src/Common/utils/navigation";
import ScreenHeader from "@/src/Common/components/ScreenHeader/ScreenHeader";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Color from "@/src/Common/constants/Color";
import * as Haptics from "expo-haptics";
import { moderateScale } from "@/src/Common/utils/dimensions";

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

const PlayerCard = ({ name, word, isImposter, onLocked }: PlayerCardProps) => {
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
    <TouchableOpacity
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
    </TouchableOpacity>
  );
};

export const RolesScreen = () => {
  const navigation: any = useNavigation();

  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues, session, players, setScreen, imposterName, newRound, roundWord } =
    useImposterSessionProvider();
  const { displayActionModal, displayInfoModal } = useModalProvider();

  const [lockedPlayers, setLockedPlayers] = useState<Set<number>>(new Set());

  useEffect(() => {
    newRound();
  }, []);

  const handleLeaveGame = () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      () => {
        clearGlobalSessionValues();
        clearImposterSessionValues();
        resetToHomeScreen(navigation);
      },
      () => {},
    );
  };

  const handleInfoPressed = () => {
    displayInfoModal(
      "Send telefonen på rundgang i rommet. Hold inn på ditt kort og hold rollen din skjult",
      "Rolle utdeling",
    );
  };

  const handleNextPressed = () => {
    if (lockedPlayers.size < players.length) {
      displayInfoModal("Noen spillere har ikke sett sin rolle", "Vent litt!");
      return;
    }
    setScreen(ImposterSessionScreen.Reveal);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        miniHeader="Finn din"
        title="rolle"
        onBackPressed={handleLeaveGame}
        onInfoPress={handleInfoPressed}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.playersWrapper}>
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              name={player}
              word={roundWord}
              isImposter={player === imposterName}
              onLocked={() => setLockedPlayers((prev) => new Set(prev).add(index))}
            />
          ))}
        </View>
        <View style={styles.helperWrapper}>
          <MaterialIcons name="touch-app" size={moderateScale(25)} color="black" />
          <Text style={styles.helperText}>Hold nede på boksen for å avsløre</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsWrapper}>
        <TouchableOpacity onPress={handleNextPressed} style={styles.nextButton}>
          <Text style={styles.buttonText}>Neste</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RolesScreen;
