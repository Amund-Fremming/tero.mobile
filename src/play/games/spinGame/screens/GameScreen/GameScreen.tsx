import Color from "@/src/core/constants/Color";
import { GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { resetToHomeGlobal } from "@/src/core/utils/navigationRef";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SpinGameState, SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import styles from "./gameScreenStyles";

export const GameScreen = () => {
  const outerNavigation: any = useNavigation();

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);

  const disconnectTriggeredRef = useRef<boolean>(false);

  const { isHost, clearGlobalSessionValues, sessionData: sessionData, gameType } = useGlobalSessionProvider();
  const { clearSpinSessionValues, setScreen, themeColor, roundText, selectedBatch, gameState, setGameState } =
    useSpinSessionProvider();
  const { disconnect, invokeFunction, debugDisconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useFocusEffect(
    useCallback(() => {
      setBgColor(themeColor);
    }, []),
  );

  useEffect(() => {
    if (gameState === SpinGameState.Finished) {
      setBgColor(Color.Gray);
      handleGameFinshed();
    } else if (gameState === SpinGameState.RoundStarted) {
      setBgColor(themeColor);
    }
  }, [gameState]);

  useEffect(() => {
    if (selectedBatch.length > 0) {
      if (pseudoId && selectedBatch.includes(pseudoId)) {
        setBgColor(Color.Green);
      } else {
        setBgColor(Color.Red);
      }
    }
  }, [selectedBatch, pseudoId]);

  const handleLeaveGame = async () => {
    await disconnect();
    clearGlobalSessionValues();
    clearSpinSessionValues();
    resetToHomeGlobal();
  };

  // Only disconnects the hub
  const handleGameFinshed = async () => {
    disconnectTriggeredRef.current = true;
    await disconnect();
  };

  // Only used when `disconnect()` is called first
  const navigateHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearGlobalSessionValues();
    clearSpinSessionValues();
    resetToHomeGlobal();
  };

  const handleNextRound = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await invokeFunction("NextRound", sessionData.gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt", () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        disconnect();
        resetToHomeScreen(outerNavigation);
      });
      return;
    }

    const state: SpinGameState = result.value;
    if (state === SpinGameState.Finished) {
      setBgColor(Color.Gray);
      setGameState(state);
      await handleGameFinshed();
    }
  };

  const handleStartRound = async () => {
    const channel = gameStarted ? "NextRound" : "StartRound";
    setGameStarted(false);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await invokeFunction(channel, sessionData.gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt", () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        disconnect();
        resetToHomeScreen(outerNavigation);
      });
      return;
    }
  };

  const handleBackPressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeGlobal();
  };

  const handleInfoPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // if (isHost) {
    //   if (gameType === GameType.Duel) {
    //     displayInfoModal(
    //       "Les opp hva de 2 utvalgte må duellere om. Når alle er klare kan du starte spinnen, grønn betyr at du er valgt.",
    //       "Hva nå?",
    //     );
    //   }
    //   if (gameType === GameType.Roulette) {
    //     displayInfoModal(
    //       "Les opp hva taperen av ruletten må gjøre. Når alle er klare kan du starte spinnen, grønn betyr at du er valgt.",
    //       "Hva nå?",
    //     );
    //   }
    // } else {
    //   if (gameType === GameType.Duel) {
    //     displayInfoModal(
    //       "Verten vil lese opp hva de 2 utvalgte må duellere om. De som får grønn farge er utvalgt!",
    //       "Hva nå?",
    //     );
    //   }
    //   if (gameType === GameType.Roulette) {
    //     displayInfoModal(
    //       "Verten vil lese opp hva taperen av ruletten må gjøre. Den som får grønn farge er utvalgt!",
    //       "Hva nå?",
    //     );
    //   }
    // }
    debugDisconnect();
  };

  const tutorialHeader = () => {
    if (gameType === GameType.Duel) {
      return "Duellen er:";
    }
    if (gameType === GameType.Roulette) {
      return "Taperen må:";
    }

    return "";
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>

      {gameState === SpinGameState.RoundStarted && (
        <View style={styles.tutorialWrapper}>
          <Text style={styles.tutorialHeader}>{tutorialHeader()}</Text>
          <Text style={styles.tutorialText}>{roundText}</Text>
        </View>
      )}

      {gameState === SpinGameState.RoundFinished && selectedBatch.includes(pseudoId) && (
        <Text style={{ ...styles.text }}>{roundText}</Text>
      )}
      {gameState === SpinGameState.Finished && <Text style={{ ...styles.text }}>"Spillet er ferdig!</Text>}

      {gameState === SpinGameState.RoundStarted && isHost && (
        <TouchableOpacity onPress={handleStartRound} style={styles.button}>
          <Text style={styles.buttonText}>Start spin</Text>
        </TouchableOpacity>
      )}

      {gameState === SpinGameState.RoundFinished && isHost && (
        <TouchableOpacity style={styles.button} onPress={handleNextRound}>
          <Text style={styles.buttonText}>Ny runde</Text>
        </TouchableOpacity>
      )}

      {gameState === SpinGameState.Finished && isHost && (
        <TouchableOpacity style={styles.button} onPress={() => setScreen(SpinSessionScreen.Create)}>
          <Text style={styles.buttonText}>Neste</Text>
        </TouchableOpacity>
      )}

      {gameState === SpinGameState.Finished && !isHost && (
        <TouchableOpacity style={styles.button} onPress={navigateHome}>
          <Text style={styles.buttonText}>Hjem</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
