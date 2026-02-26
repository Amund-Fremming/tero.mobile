import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./gameScreenStyles";
import { useEffect, useState, useRef, useCallback } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import Color from "@/src/Common/constants/Color";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { moderateScale } from "@/src/Common/utils/dimensions";
import { resetToHomeScreen } from "@/src/Common/utils/navigation";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);

  const disconnectTriggeredRef = useRef<boolean>(false);

  const { isHost, clearGlobalSessionValues, gameKey } = useGlobalSessionProvider();
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
      console.debug("Host received game finished");
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

  const handleInfoPressed = () => {
    console.log("Info pressed");
    debugDisconnect();
  };

  const handleBackPressed = async () => {
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(navigation);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        {/* TODO - remove this ? not needed here */}
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>x</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ ...styles.text }}>
        {gameState === SpinGameState.RoundStarted && isHost && `"${roundText}"`}
        {gameState === SpinGameState.RoundStarted && !isHost && "Gjør deg klar!"}
        {gameState === SpinGameState.RoundFinished && "Venter på ny runde"}
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
