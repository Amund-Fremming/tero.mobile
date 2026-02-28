import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./gameScreenStyles";
import { useEffect, useState, useRef, useCallback } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import Color from "@/src/core/constants/Color";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { moderateScale } from "@/src/core/utils/dimensions";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { GameType } from "@/src/core/constants/Types";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);

  const disconnectTriggeredRef = useRef<boolean>(false);

  const { isHost, clearGlobalSessionValues, gameKey, gameType } = useGlobalSessionProvider();
  const { clearSpinSessionValues, themeColor, roundText, selectedBatch, gameState, setGameState } =
    useSpinSessionProvider();
  const { disconnect, invokeFunction, debugDisconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useFocusEffect(
    useCallback(() => {
      setBgColor(themeColor);

      return () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        disconnect();
      };
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
    clearGlobalSessionValues();
    clearSpinSessionValues();
    await disconnect();
    resetToHomeScreen(navigation);
  };

  // Only disconnects the hub
  const handleGameFinshed = async () => {
    disconnectTriggeredRef.current = true;
    await disconnect();
  };

  // Only used when `disconnect()` is called first
  const navigateHome = () => {
    clearGlobalSessionValues();
    clearSpinSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleNextRound = async () => {
    const result = await invokeFunction("NextRound", gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("Koblingsfeil.");
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

    const result = await invokeFunction(channel, gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("Koblingsfeil.");
      return;
    }
  };

  const handleBackPressed = async () => {
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    if (isHost) {
      if (gameType === GameType.Duel) {
        displayInfoModal(
          "Les opp hva de 2 utvalgte må duellere om. Når alle er klare kan du starte spinnen, grønn betyr at du er valgt.",
          "Hva nå?",
        );
      }
      if (gameType === GameType.Roulette) {
        displayInfoModal(
          "Les opp hva taperen av ruletten må gjøre. Når alle er klare kan du starte spinnen, grønn betyr at du er valgt.",
          "Hva nå?",
        );
      }
    } else {
      if (gameType === GameType.Duel) {
        displayInfoModal(
          "Verten vil lese opp hva de 2 utvalgte må duellere om. De som får grønn farge er utvalgt!",
          "Hva nå?",
        );
      }
      if (gameType === GameType.Roulette) {
        displayInfoModal(
          "Verten vil lese opp hva taperen av ruletten må gjøre. Den som får grønn farge er utvalgt!",
          "Hva nå?",
        );
      }
    }
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

      <Text style={{ ...styles.text }}>
        {gameState === SpinGameState.RoundStarted && isHost && `"${roundText}"`}
        {gameState === SpinGameState.RoundStarted && !isHost && "Gjør deg klar!"}
        {gameState === SpinGameState.RoundFinished && ""}
        {gameState === SpinGameState.Finished && "Spillet er ferdig!"}
      </Text>

      {gameState === SpinGameState.RoundStarted && isHost && (
        <Pressable onPress={handleStartRound} style={styles.button}>
          <Text style={styles.buttonText}>Start spin</Text>
        </Pressable>
      )}

      {gameState === SpinGameState.RoundFinished && isHost && (
        <Pressable style={styles.button} onPress={handleNextRound}>
          <Text style={styles.buttonText}>Ny runde</Text>
        </Pressable>
      )}

      {gameState === SpinGameState.Finished && (
        <Pressable style={styles.button} onPress={navigateHome}>
          <Text style={styles.buttonText}>Hjem</Text>
        </Pressable>
      )}
    </View>
  );
};
