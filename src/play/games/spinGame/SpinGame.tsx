import { HubChannel } from "@/src/core/constants/HubChannel";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useHubConnectionProvider } from "../../context/HubConnectionProvider";
import { SpinGameState, SpinSessionScreen } from "./constants/SpinTypes";
import { useSpinSessionProvider } from "./context/SpinGameProvider";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import FinishedScreen from "./screens/FinishedScreen/FinishedScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import PassiveLobbyScreen from "./screens/PassiveLobbyScreen/PassiveLobbyScreen";
import TutorialScreen from "./screens/TutorialScreen/TutorialScreen";

export const SpinGame = () => {
  const outerNavigation: any = useNavigation();
  const {
    gameEntryMode,
    sessionData: sessionData,
    setIsHost,
    clearGlobalSessionValues,
    isDraft,
    gameType,
    isHost,
  } = useGlobalSessionProvider();
  const {
    screen,
    setScreen,
    setRoundText,
    setSelectedBatch,
    setGameState,
    setIterations,
    setPlayers,
    setThemeColors,
    clearSpinSessionValues,
  } = useSpinSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  const isHandlingErrorRef = useRef(false);
  const [hubReady, setHubReady] = useState<boolean>(false);

  const handleLeavePressed = async () => {
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(outerNavigation);
  };

  useEffect(() => {
    setThemeColors(gameType);

    if (gameEntryMode === GameEntryMode.Participant) {
      setIsHost(false);
    }

    setScreen(SpinSessionScreen.Tutorial);
    setHubReady(true);

    return () => {
      disconnect();
      clearSpinSessionValues();
      clearGlobalSessionValues();
    };
  }, []);

  const initializeHub = async (hubName: string, key: string) => {
    const result = await connect(hubName);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt", () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        disconnect();
        resetToHomeScreen(outerNavigation);
      });
      return;
    }

    setupListeners();

    const groupResult = await invokeFunction("ConnectToGroup", key, pseudoId);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Kunne ikke koble til.");
      return;
    }

    let gameHasStarted = groupResult.value;
    if (gameHasStarted) {
      setHubReady(true);
      setScreen(SpinSessionScreen.Game);
      return;
    }
    setHubReady(true);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });

    setListener("signal_start", (_value: boolean) => {
      setScreen(SpinSessionScreen.Game);
    });

    setListener(HubChannel.State, async (state: SpinGameState) => {
      console.log("EntryMode=" + gameEntryMode + ", State=" + state);
      setGameState(state);
      if (state === SpinGameState.Finished) {
        if (gameEntryMode === GameEntryMode.Creator) {
          setScreen(SpinSessionScreen.Create);
        } else {
          await disconnect();
          setScreen(SpinSessionScreen.Finished);
        }
      }
    });

    setListener("selected", (batch: string[]) => {
      setSelectedBatch(batch);
    });

    setListener("round_text", (roundText: string) => {
      setRoundText(roundText);
    });

    setListener(HubChannel.Error, (message: string) => {
      if (isHandlingErrorRef.current) return;
      isHandlingErrorRef.current = true;

      displayErrorModal(message, async () => {
        await handleLeavePressed();
      });
    });

    setListener("cancelled", async (message: string) => {
      if (isHandlingErrorRef.current) return;
      isHandlingErrorRef.current = true;

      await disconnect();
      displayInfoModal(message, "Avsluttet", async () => {
        clearSpinSessionValues();
        clearGlobalSessionValues();
        resetToHomeScreen(outerNavigation);
      });
    });

    setListener("players_count", (count: number) => {
      setPlayers(count);
    });

    setListener(HubChannel.Iterations, (count: number) => {
      setIterations(count);
    });
  };

  if (!hubReady && screen !== SpinSessionScreen.Create && screen !== SpinSessionScreen.Tutorial) {
    return <LoadingView />;
  }

  switch (screen) {
    case SpinSessionScreen.Tutorial:
      return <TutorialScreen initializeHub={(a, k) => initializeHub(a, k)} />;
    case SpinSessionScreen.Create:
      return <CreateScreen />;
    case SpinSessionScreen.ActiveLobby:
      return <ActiveLobbyScreen />;
    case SpinSessionScreen.PassiveLobby:
      return <PassiveLobbyScreen onLeave={handleLeavePressed} />;
    case SpinSessionScreen.Game:
      return <GameScreen onLeave={handleLeavePressed} />;
    case SpinSessionScreen.Finished:
      return <FinishedScreen onLeave={handleLeavePressed} />;
    default:
      return <GameScreen onLeave={handleLeavePressed} />;
  }
};

const LoadingView = () => {
  const { themeColor } = useSpinSessionProvider();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: themeColor }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SpinGame;
