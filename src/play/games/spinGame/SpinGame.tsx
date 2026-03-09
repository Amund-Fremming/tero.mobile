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

  const resetSessionAndNavigateHome = async () => {
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(outerNavigation);
  };

  useEffect(() => {
    setThemeColors(gameType);

    if ([GameEntryMode.Member, GameEntryMode.Participant].includes(gameEntryMode)) {
      setIsHost(false);
    }

    const initScreen = getInitialScreen();
    setScreen(initScreen);
    if (initScreen !== SpinSessionScreen.Create && initScreen !== SpinSessionScreen.Tutorial) {
      initializeHub(sessionData.hubName, sessionData.gameKey, initScreen);
    } else {
      setHubReady(true);
    }

    return () => {
      disconnect();
      clearSpinSessionValues();
      clearGlobalSessionValues();
    };
  }, []);

  const initializeHub = async (hubName: string, key: string, targetScreen: SpinSessionScreen) => {
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
    setScreen(targetScreen);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });

    setListener("signal_start", (_value: boolean) => {
      setScreen(SpinSessionScreen.Game);
    });

    setListener(HubChannel.State, async (state: SpinGameState) => {
      if (state === SpinGameState.Finished && !isHost) {
        await disconnect();
      }
      setGameState(state);
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
        await resetSessionAndNavigateHome();
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

  const getInitialScreen = (): SpinSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return SpinSessionScreen.Tutorial;
      case GameEntryMode.Host:
        return SpinSessionScreen.PassiveLobby;
      case GameEntryMode.Participant:
      case GameEntryMode.Member:
        if (isDraft) {
          return SpinSessionScreen.ActiveLobby;
        } else {
          return SpinSessionScreen.PassiveLobby;
        }
      default:
        return SpinSessionScreen.ActiveLobby;
    }
  };

  if (!hubReady && screen !== SpinSessionScreen.Create && screen !== SpinSessionScreen.Tutorial) {
    return <LoadingView />;
  }

  switch (screen) {
    case SpinSessionScreen.Tutorial:
      return <TutorialScreen onGameCreated={(a, k) => initializeHub(a, k, SpinSessionScreen.ActiveLobby)} />;
    case SpinSessionScreen.Create:
      return <CreateScreen />;
    case SpinSessionScreen.ActiveLobby:
      return <ActiveLobbyScreen />;
    case SpinSessionScreen.PassiveLobby:
      return <PassiveLobbyScreen />;
    case SpinSessionScreen.Game:
      <GameScreen />;
    default:
      return <GameScreen />;
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
