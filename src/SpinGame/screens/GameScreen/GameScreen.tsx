import { Pressable, Text, View } from "react-native";
import styles from "./gameScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useEffect, useState } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import { GameEntryMode } from "@/src/Common/constants/Types";
import Color from "@/src/Common/constants/Color";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import Screen from "@/src/Common/constants/Screen";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useSpinGameProvider } from "../../context/SpinGameProvider";

export const GameScreen = ({ navigation }: any) => {
  const [bgColor, setBgColor] = useState<string>(Color.Gray);
  const [state, setState] = useState<SpinGameState>(SpinGameState.RoundStarted);
  const [roundText, setRoundText] = useState<string>("");

  const { disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { gameEntryMode, gameKey } = useGlobalGameProvider();
  const { displayErrorModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  const isHost = gameEntryMode === GameEntryMode.Creator || gameEntryMode === GameEntryMode.Host;

  useEffect(() => {
    setupListeners().then(() => handleStartGame());
  }, []);

  const setupListeners = async () => {
    setListener(HubChannel.Error, (message: string) => {
      console.info("Received error message:", roundText);
      displayErrorModal(message);
    });

    setListener("round_text", (roundText: string) => {
      console.info("Received round text:", roundText);
      setRoundText(roundText);
    });

    setListener(HubChannel.State, (state: SpinGameState) => {
      console.info("Received state:", state);
      setState(state);
    });

    setListener("selected", (selectedId: string) => {
      console.info("Received selected user:", selectedId);
      if (selectedId === pseudoId) {
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

  const handleStartRound = async () => {
    console.debug("Starting spin");
    const result = await invokeFunction("StartRound", gameKey);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En feil har skjedd med forbindelsen");
      return;
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      {state === SpinGameState.RoundStarted && isHost && (
        <View>
          <Text>{roundText}</Text>

          <Pressable onPress={handleStartRound}>
            <Text>Start spin</Text>
          </Pressable>
        </View>
      )}

      {state === SpinGameState.RoundStarted && (
        <View>
          <Text>Gjør deg klar!</Text>
        </View>
      )}

      {state === SpinGameState.RoundInProgress && (
        <View>
          <Text>Spinner..</Text>
          {/* TODO? */}
        </View>
      )}

      {state === SpinGameState.RoundFinished && isHost && (
        <View>
          <Text>Venter på ny runde</Text>
        </View>
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

      <AbsoluteHomeButton />
    </View>
  );
};
