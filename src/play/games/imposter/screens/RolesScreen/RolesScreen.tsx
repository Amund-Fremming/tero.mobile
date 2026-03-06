import ScreenHeaderChildren from "@/src/core/components/ScreenHeader/ScreenHeaderChildren";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./rolesScreenStyles";

export const RolesScreen = () => {
  const navigation: any = useNavigation();

  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues, players, imposterName, newRound, roundWord, setScreen } =
    useImposterSessionProvider();
  const { displayActionModal, displayInfoModal } = useModalProvider();

  const [lockedPlayers, setLockedPlayers] = useState<Set<number>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);
  const navigatingOpacity = useRef(new Animated.Value(0)).current;
  const hasAutoAdvanced = useRef(false);
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    newRound();
  }, []);

  useEffect(() => {
    const hasAllPlayersLocked = players.length > 0 && lockedPlayers.size === players.length;

    if (!hasAllPlayersLocked || hasAutoAdvanced.current) {
      return;
    }

    hasAutoAdvanced.current = true;
    setIsNavigating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.timing(navigatingOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    });

    autoAdvanceTimeout.current = setTimeout(() => {
      setScreen(ImposterSessionScreen.RoundInstructions);
    }, 1000);

    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, [lockedPlayers.size, navigatingOpacity, players.length, setScreen]);

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

  return (
    <View style={styles.container}>
      <ScreenHeaderChildren onBackPressed={handleLeaveGame} onInfoPress={handleInfoPressed}>
        <View style={styles.headerInline}>
          <Text style={styles.toastHeader}>ER DU</Text>
          <Text style={styles.headerSecondScreen}>Imposter?</Text>
        </View>
      </ScreenHeaderChildren>
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
          <MaterialIcons name="touch-app" size={moderateScale(30)} color="black" />
          <View style={styles.helperTextWrapper}>
            <Text style={styles.helperText}>Hold nede på boksen for å avsløre</Text>
            <Text style={styles.helperText}>{"( ikke la naboen titte )"}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonsWrapper}>
        {isNavigating && (
          <Animated.Text style={[styles.navigatingText, { opacity: navigatingOpacity }]}>Navigerer</Animated.Text>
        )}
      </View>
    </View>
  );
};

export default RolesScreen;
