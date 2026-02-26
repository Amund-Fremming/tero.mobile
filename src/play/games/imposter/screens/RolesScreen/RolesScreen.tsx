import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import styles from "./rolesScreenStyles";
import { useEffect, useState } from "react";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useNavigation } from "expo-router";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "@/src/core/utils/dimensions";
import PlayerCard from "../../components/PlayerCard/PlayerCard";

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
