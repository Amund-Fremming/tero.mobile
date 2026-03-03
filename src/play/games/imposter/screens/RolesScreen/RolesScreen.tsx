import ScreenHeaderChildren from "@/src/core/components/ScreenHeader/ScreenHeaderChildren";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScreen(ImposterSessionScreen.Reveal);
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
