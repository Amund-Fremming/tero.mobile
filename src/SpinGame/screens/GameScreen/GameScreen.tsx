import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./gameScreenStyles";
import { useEffect, useState, useRef, useCallback } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import Color from "@/src/common/constants/Color";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { HubChannel } from "@/src/common/constants/HubChannel";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useSpinSessionProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { moderateScale } from "@/src/common/utils/dimensions";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [state, setState] = useState<SpinGameState>(SpinGameState.RoundStarted);
  const [roundText, setRoundText] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [hasStartedGame, setHasStartedGame] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);

  const disconnectTriggeredRef = useRef<boolean>(false);

  const { isHost, setIsHost, clearGlobalSessionValues, hubAddress } = useGlobalSessionProvider();
  const { clearSpinSessionValues, themeColor } = useSpinSessionProvider();
  const { disconnect, setListener, invokeFunction, debugDisconnect, connect } = useHubConnectionProvider();
  const { gameKey } = useGlobalSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useFocusEffect(
    useCallback(() => {
      setBgColor(themeColor);
      setupListeners().then(() => {
        if (!hasStartedGame && isHost) {
          handleStartGame();
        }
      });

      return () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        disconnect();
      };
    }, []),
  );

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

  const setupListeners = async () => {
    let connectResult = await connect(hubAddress);
    if (connectResult.isError()) {
      displayErrorModal("Klarte ikke opprette tilkobling", () => {
        handleBackPressed();
      });
    }

    setListener(HubChannel.Error, (message: string) => {
      displayErrorModal(message);
      handleLeaveGame();
    });

    setListener("round_text", (roundText: string) => {
      setRoundText(roundText);
    });

    setListener(HubChannel.State, async (state: SpinGameState) => {
      setState(state);

      if (state == SpinGameState.Finished) {
        setBgColor(Color.Gray);
        await handleGameFinshed();
      }

      if (state == SpinGameState.RoundStarted) {
        setBgColor(themeColor);
      }
    });

    setListener("host", (hostId: string) => {
      setIsHost(hostId == pseudoId);
    });

    setListener("cancelled", async (message: string) => {
      if (disconnectTriggeredRef.current) return;

      await disconnect();
      displayInfoModal(message, "Spillet ble avsluttet", () => {
        navigateHome();
      });
    });

    setListener("selected", (batch: string[]) => {
      if (pseudoId && batch.includes(pseudoId)) {
        setBgColor(Color.Green);
      } else {
        setBgColor(Color.Red);
      }
    });
  };

  const handleStartGame = async () => {
    if (!gameKey || gameKey == "") {
      displayErrorModal("Mangler spill nøkkel");
      return;
    }

    const result = await invokeFunction("StartGame", gameKey);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke starte spill, prøv igjen senere");
      return;
    }

    setHasStartedGame(true);
  };

  const handleNextRound = async () => {
    const result = await invokeFunction("NextRound", gameKey);
    if (result.isError()) {
      if (disconnectTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("En feil har skjedd med forbindelsen");
      return;
    }

    const state: SpinGameState = result.value;
    if (state === SpinGameState.Finished) {
      console.debug("Host received game finished");
      setBgColor(Color.Gray);
      setState(state);
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
      displayErrorModal("En feil har skjedd med forbindelsen");
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
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ ...styles.text }}>
        {state === SpinGameState.RoundStarted && isHost && roundText}
        {state === SpinGameState.RoundStarted && !isHost && "Gjør deg klar!"}
        {state === SpinGameState.RoundFinished && "Venter på ny runde"}
        {state === SpinGameState.Finished && "Spillet er ferdig!"}
      </Text>

      {state === SpinGameState.RoundStarted && isHost && (
        <Pressable onPress={handleStartRound} style={styles.button}>
          <Text style={styles.buttonText}>Start spin</Text>
        </Pressable>
      )}

      {state === SpinGameState.RoundFinished && isHost && (
        <Pressable style={styles.button} onPress={handleNextRound}>
          <Text style={styles.buttonText}>Ny runde</Text>
        </Pressable>
      )}

      {state === SpinGameState.Finished && (
        <Pressable style={styles.button} onPress={navigateHome}>
          <Text style={styles.buttonText}>Hjem</Text>
        </Pressable>
      )}
    </View>
  );
};
