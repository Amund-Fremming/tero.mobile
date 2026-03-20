import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SpinGameState, SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import styles from "./gameScreenStyles";

type Props = {
  onLeave: () => void;
};

export const GameScreen = ({ onLeave }: Props) => {
  const outerNavigation: any = useNavigation();

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);

  const disconnectTriggeredRef = useRef<boolean>(false);

  const { isHost, clearGlobalSessionValues, sessionData, gameType, gameEntryMode } = useGlobalSessionProvider();
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
      setBgColor(themeColor);
    } else if (gameState === SpinGameState.RoundStarted) {
      setBgColor(themeColor);
    }
  }, [gameState]);

  useEffect(() => {
    if (selectedBatch.length > 0) {
      if (pseudoId && selectedBatch.includes(pseudoId)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setBgColor(Color.SpinChosen);
      } else {
        setBgColor(themeColor);
      }
    }
  }, [selectedBatch, pseudoId]);

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

    const state = result.value;
    if (state === SpinGameState.Finished && gameEntryMode === GameEntryMode.Host) {
      await disconnect();
      setScreen(SpinSessionScreen.Finished);
    }
  };
  SpinGameState;
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
    onLeave();
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
      <ScreenHeader onBackPressed={handleBackPressed} onInfoPress={() => debugDisconnect()} title="">
        <View style={styles.headerInline}>
          <Text style={styles.toastHeader}>Rom:</Text>
          <Text style={styles.headerSecondScreen}>{sessionData.gameKey?.toUpperCase()}</Text>
        </View>
      </ScreenHeader>

      {gameState === SpinGameState.RoundStarted && (
        <View style={styles.tutorialWrapper}>
          <Text style={styles.tutorialHeader}>{tutorialHeader()}</Text>
          <Text style={styles.tutorialText}>{roundText}</Text>
        </View>
      )}

      {gameState === SpinGameState.RoundFinished && selectedBatch.includes(pseudoId) && (
        <Text style={{ ...styles.text }}>{roundText}</Text>
      )}

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
    </View>
  );
};
