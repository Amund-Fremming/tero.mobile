import { Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./gameScreenStyles";
import { useEffect, useState, useRef } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import Color from "@/src/Common/constants/Color";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import Screen from "@/src/Common/constants/Screen";
import { moderateScale } from "@/src/Common/utils/dimensions";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [state, setState] = useState<SpinGameState>(SpinGameState.RoundStarted);
  const [roundText, setRoundText] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [hasStartedGame, setHasStartedGame] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>(Color.Gray);

  const exitTriggeredRef = useRef<boolean>(false);

  const { isHost, setIsHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearSpinSessionValues, themeColor } = useSpinGameProvider();
  const { disconnect, setListener, invokeFunction, debugDisconnect } = useHubConnectionProvider();
  const { gameKey } = useGlobalSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useEffect(() => {
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
  }, []);

  const handleLeaveGame = async () => {
    clearGlobalSessionValues();
    clearSpinSessionValues();
    await disconnect();
  };

  const setupListeners = async () => {
    setListener(HubChannel.Error, (message: string) => {
      console.info("Received error message:", roundText);
      displayErrorModal(message);
    });

    setListener("round", (roundText: string) => {
      console.info("Received round text:", roundText);
      setRoundText(roundText);
    });

    setListener(HubChannel.State, async (state: SpinGameState) => {
      console.info("Received state:", state);
      setState(state);

      if (state == SpinGameState.RoundStarted || state == SpinGameState.Finished) {
        setBgColor(themeColor);
      }

      if (state === SpinGameState.Finished) {
        await disconnect();
        displayInfoModal("Spillet er ferdig", "Finito!", handleLeaveGame);
      }
    });

    setListener("host", (hostId: string) => {
      if (hostId == pseudoId) {
        console.info("Received new host:", hostId);
        setIsHost(hostId == pseudoId);
      }
    });

    setListener("cancelled", (message: string) => {
      displayInfoModal(message, "Spillet ble avsluttet", handleLeaveGame);
    });

    setListener("selected", (batch: string[]) => {
      console.info("Received selected users:", batch);
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
    console.debug("Game key:", gameKey);

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
      if (exitTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("En feil har skjedd med forbindelsen");
      return;
    }
  };

  const handleStartRound = async () => {
    const channel = gameStarted ? "NextRound" : "StartRound";
    setGameStarted(false);

    console.debug("Starting spin");
    const result = await invokeFunction(channel, gameKey);
    if (result.isError()) {
      if (exitTriggeredRef.current) return; // User left the game, don't show error

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
    navigation.goBack();
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
    </View>
  );
};
