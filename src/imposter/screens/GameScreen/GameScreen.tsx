import { Pressable, Text, View } from "react-native";
import styles from "./gameScreenStyles";
import { useEffect, useState, useRef } from "react";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import Color from "@/src/common/constants/Color";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { ImposterGameState } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const [bgColor, setBgColor] = useState<string>(Color.Gray);
  const [state, setState] = useState<ImposterGameState>(ImposterGameState.Initialized);
  const [roundText, setRoundText] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const exitTriggeredRef = useRef<boolean>(false);
  const hasStartedGameRef = useRef<boolean>(false);

  const { isHost, setIsHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues } = useImposterSessionProvider();
  const { disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { gameKey } = useGlobalSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useEffect(() => {
    setupListeners().then(() => {
      if (!hasStartedGameRef.current && isHost) {
        hasStartedGameRef.current = true;
        handleStartGame();
      }
    });

    return () => {
      clearImposterSessionValues();
      clearGlobalSessionValues();
      disconnect();
    };
  }, []);

  const setupListeners = async () => {
    //
  };

  const handleStartGame = async () => {
    if (!gameKey || gameKey == "") {
      displayErrorModal("Mangler spill nøkkel");
      return;
    }
    console.debug("Game key:", gameKey);

    const result = await invokeFunction("StartGame", gameKey, true); // isDraft = true
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke starte spillet.");
      return;
    }
  };

  const handleNextRound = async () => {
    const result = await invokeFunction("NextRound", gameKey);
    if (result.isError()) {
      if (exitTriggeredRef.current) return; // User left the game, don't show error

      console.error(result.error);
      displayErrorModal("Koblingsfeil.");
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
      displayErrorModal("Koblingsfeil.");
      return;
    }
  };

  const handleLeaveGame = async () => {
    exitTriggeredRef.current = true;
    await disconnect();
    clearGlobalSessionValues();
    clearImposterSessionValues();
    resetToHomeScreen(navigation);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View>
        <Pressable onPress={handleLeaveGame}>
          <Feather name="chevron-left" size={45} />
        </Pressable>
      </View>
    </View>
  );
};

export default GameScreen;
