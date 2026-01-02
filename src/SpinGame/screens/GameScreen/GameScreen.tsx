import { Pressable, Text, View } from "react-native";
import styles from "./gameScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useEffect, useState } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { GameEntryMode } from "@/src/Common/constants/Types";
import Color from "@/src/Common/constants/Color";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [bgColor, setBgColor] = useState<string>(Color.Gray);
  const [state, setState] = useState<SpinGameState>(SpinGameState.RoundStarted);
  const [roundText, setRoundText] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const { isHost, setIsHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearSpinSessionValues } = useSpinGameProvider();
  const { disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { gameKey } = useGlobalSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useEffect(() => {
    setupListeners().then(() => handleStartGame());

    return () => {
      clearSpinSessionValues();
      clearGlobalSessionValues();
      disconnect();
    };
  }, []);

  const setupListeners = async () => {
    setListener(HubChannel.Error, (message: string) => {
      console.info("Received error message:", roundText);
      displayErrorModal(message);
    });

    setListener("round", (roundText: string) => {
      console.info("Received round text:", roundText);
      setRoundText(roundText);
    });

    setListener(HubChannel.State, (state: SpinGameState) => {
      console.info("Received state:", state);
      setState(state);
      if (state == SpinGameState.RoundStarted || state == SpinGameState.Finished) {
        setBgColor(Color.Gray);
      }
    });

    setListener("host", (hostId: string) => {
      console.info("Received new host:", hostId);
      setIsHost(hostId == pseudoId);
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
  };

  const handleNextRound = async () => {
    const result = await invokeFunction("NextRound", gameKey);
    if (result.isError()) {
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
      console.error(result.error);
      displayErrorModal("En feil har skjedd med forbindelsen");
      return;
    }
  };

  const handleLeaveGame = async () => {
    await disconnect();
    navigation.goBack();
    clearGlobalSessionValues();
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View>
        <Pressable onPress={handleLeaveGame}>
          <Feather name="chevron-left" size={45} />
        </Pressable>
      </View>
      {state === SpinGameState.RoundStarted && isHost && (
        <View>
          <Text>{roundText}</Text>

          <Pressable onPress={handleStartRound}>
            <Text>Start spin</Text>
          </Pressable>
        </View>
      )}

      {state === SpinGameState.RoundStarted && !isHost && (
        <View>
          <Text>Gjør deg klar!</Text>
        </View>
      )}

      {state === SpinGameState.RoundFinished && isHost && (
        <Pressable onPress={handleNextRound}>
          <Text>Ny runde</Text>
        </Pressable>
      )}

      {state === SpinGameState.RoundFinished && (
        <View>
          <Text>Venter på ny runde</Text>
        </View>
      )}

      {state === SpinGameState.Finished && (
        <View>
          <Text>Spillet er ferdig!</Text>
        </View>
      )}
    </View>
  );
};
