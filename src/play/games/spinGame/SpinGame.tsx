import React, { useEffect, useState, useRef } from "react";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";
import PassiveLobbyScreen from "./screens/PassiveLobbyScreen/PassiveLobbyScreen";
import { SpinSessionScreen, SpinGameState } from "./constants/SpinTypes";
import { useSpinSessionProvider } from "./context/SpinGameProvider";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useHubConnectionProvider } from "../../context/HubConnectionProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { HubChannel } from "@/src/core/constants/HubChannel";

export const SpinGame = () => {
  const navigation: any = useNavigation();
  const { gameEntryMode, hubName, gameKey, setIsHost, clearGlobalSessionValues, isDraft, gameType } =
    useGlobalSessionProvider();
  const { screen, setScreen, setRoundText, setSelectedBatch, setGameState, setIterations, setPlayers, setThemeColors } =
    useSpinSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();
  const { clearSpinSessionValues } = useSpinSessionProvider();

  const isHandlingErrorRef = useRef(false);
  const [hubReady, setHubReady] = useState<boolean>(false);

  const resetSessionAndNavigateHome = async () => {
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(navigation);
  };

  useEffect(() => {
    setThemeColors(gameType);

    const initScreen = getInitialScreen();
    setScreen(initScreen);

    if (initScreen === SpinSessionScreen.Create) {
      return;
    }

    initializeHub(hubName, gameKey, initScreen);

    return () => {
      disconnect();
    };
  }, []);

  const initializeHub = async (hubName: string, key: string, initialScreen: SpinSessionScreen) => {
    const result = await connect(hubName);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt");
      return;
    }

    setupListeners();

    const groupResult = await invokeFunction("ConnectToGroup", key, pseudoId, false);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Kunne ikke koble til.");
      return;
    }

    setHubReady(true);
    setScreen(initialScreen);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });

    setListener("signal_start", (_value: boolean) => {
      setScreen(SpinSessionScreen.Game);
    });

    setListener(HubChannel.State, (state: SpinGameState) => {
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
        resetToHomeScreen(navigation);
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
    if (!isDraft) {
      return SpinSessionScreen.PassiveLobby;
    }

    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return SpinSessionScreen.Create;
      case GameEntryMode.Host:
        return SpinSessionScreen.PassiveLobby;
      case GameEntryMode.Participant:
      case GameEntryMode.Member:
        return SpinSessionScreen.ActiveLobby;
      default:
        return SpinSessionScreen.ActiveLobby;
    }
  };

  const resolvedScreen =
    screen === SpinSessionScreen.Create && gameEntryMode !== GameEntryMode.Creator ? getInitialScreen() : screen;

  switch (resolvedScreen) {
    case SpinSessionScreen.Create:
      return (
        <CreateScreen onGameCreated={(address, key) => initializeHub(address, key, SpinSessionScreen.ActiveLobby)} />
      );
    case SpinSessionScreen.Game:
      return hubReady ? <GameScreen /> : <LoadingView />;
    case SpinSessionScreen.ActiveLobby:
      return hubReady ? <ActiveLobbyScreen /> : <LoadingView />;
    case SpinSessionScreen.PassiveLobby:
      return hubReady ? <PassiveLobbyScreen /> : <LoadingView />;
    default:
      return hubReady ? <ActiveLobbyScreen /> : <LoadingView />;
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
