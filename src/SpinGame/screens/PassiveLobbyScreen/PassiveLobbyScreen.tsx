import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./passiveLobbyScreenStyles";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/common/utils/dimensions";
import { useNavigation } from "expo-router";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { resetToHomeScreen } from "@/src/common/utils/navigation";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { GameType } from "@/src/common/constants/Types";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useEffect, useState } from "react";

export const PassiveLobbyScreen = () => {
  const navigation: any = useNavigation();
  const { gameKey, clearGlobalSessionValues, isHost, gameType } = useGlobalSessionProvider();
  const { themeColor, clearSpinSessionValues, players, iterations, setScreen } = useSpinSessionProvider();
  const { disconnect, invokeFunction } = useHubConnectionProvider();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();

  const [startGameTriggered, setStartGameTriggered] = useState(false);

  const handleBackPressed = async () => {
    await disconnect();
    clearGlobalSessionValues();
    clearSpinSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  const handleStartGame = async () => {
    if (startGameTriggered) {
      return;
    }

    setStartGameTriggered(true);
    if (!isHost) {
      console.error("Only hosts can start a game");
      setStartGameTriggered(false);
      return;
    }

    if (!pseudoId) {
      console.error("No pseudo id present");
      displayErrorModal("Noe gikk galt.");
      setStartGameTriggered(false);
      return;
    }

    if (!gameKey || gameKey == "") {
      displayErrorModal("Mangler spillkode. Lag spillet på nytt.");
      setStartGameTriggered(false);
      return;
    }

    const minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Minst ${minPlayers} spillere. Nå: ${players}.`);
      setStartGameTriggered(false);
      return;
    }

    if (iterations < 1) {
      // TODO set to 10!
      displayInfoModal("Minst 10 runder.");
      setStartGameTriggered(false);
      return;
    }

    const startResult = await invokeFunction("StartGame", gameKey, false); // isDraft = false
    if (startResult.isError()) {
      console.log(startResult.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStartGameTriggered(false);
      return;
    }

    const gameReady = startResult.value;
    if (!gameReady) {
      console.log("Game not ready");
      setStartGameTriggered(false);
      return;
    }

    setScreen(SpinSessionScreen.Game);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <View style={styles.headerInline}>
          <Text style={styles.toastHeader}>Rom:</Text>
          <Text style={styles.headerSecondScreen}>{gameKey?.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>

      {!isHost && <Text style={styles.centerText}>venter på at sjefen starter spillet</Text>}

      {isHost && (
        <>
          <Text style={styles.players}>
            {players} {players > 1 ? "Spillere" : "Spiller"}
          </Text>
          <TouchableOpacity onPress={handleStartGame} style={styles.button}>
            <Text style={styles.buttonText}>Start spill</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PassiveLobbyScreen;
