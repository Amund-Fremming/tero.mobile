import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { GameType } from "@/src/core/constants/Types";
import { getGameTheme } from "@/src/play/config/gameTheme";
import SimpleTutorial from "@/src/play/screens/GenericTutorialScreen/components/SimpleTutorial/SimpleTutorial";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./roundInstructionsScreenStyles";

export const RoundInstructionsScreen = () => {
  const { imposterSession, players, setScreen } = useImposterSessionProvider();
  const theme = getGameTheme(GameType.Imposter);

  const playerNames = useMemo(() => {
    const sessionPlayers = imposterSession?.players ? Array.from(imposterSession.players) : [];
    return sessionPlayers.length > 0 ? sessionPlayers : players;
  }, [imposterSession?.players, players]);

  const starterName = useMemo(() => {
    if (playerNames.length === 0) {
      return "En spiller";
    }

    return playerNames[Math.floor(Math.random() * playerNames.length)];
  }, [playerNames]);

  const items = useMemo(
    () => [
      `${starterName} starter ved å si en assosiasjon til ordet han så/ikke så`,
      "Fortsett en hel runde",
      "Stem på hvem dere tror er imposter",
      "Avslutt spillet ved å se hvem det var, eller fortsett til dere finner imposteren",
    ],
    [starterName],
  );

  const handleRevealPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScreen(ImposterSessionScreen.Reveal);
  };

  const handleBackPress = () => {
    setScreen(ImposterSessionScreen.Roles);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader
        title={`Runde ${imposterSession?.currentIteration ?? 0 + 1}`}
        onBackPressed={handleBackPress}
        showBorder
        backgroundColor={theme.primaryColor}
      />
      <View style={styles.content}>
        <SimpleTutorial title="Rundens gang" items={items} accentColor={theme.secondaryColor} />
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={handleRevealPress}
          style={[styles.revealButton, { backgroundColor: theme.secondaryColor }]}
        >
          <Text style={styles.revealButtonText}>Avslør imposteren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoundInstructionsScreen;
