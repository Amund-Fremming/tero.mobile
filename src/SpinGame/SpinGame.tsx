import React, { useEffect, useState, useRef } from "react";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { GameEntryMode } from "../common/constants/Types";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";
import PassiveLobbyScreen from "./screens/PassiveLobbyScreen/PassiveLobbyScreen";
import { SpinSessionScreen, SpinGameState } from "./constants/SpinTypes";
import { useSpinSessionProvider } from "./context/SpinGameProvider";
import { useHubConnectionProvider } from "../common/context/HubConnectionProvider";
import { useModalProvider } from "../common/context/ModalProvider";
import { useAuthProvider } from "../common/context/AuthProvider";
import { HubChannel } from "../common/constants/HubChannel";
import { View, ActivityIndicator } from "react-native";
import { resetToHomeScreen } from "../common/utils/navigation";
import { useNavigation } from "expo-router";

export const SpinGame = () => {
  const navigation: any = useNavigation();
  const { gameEntryMode, hubAddress, gameKey, setIsHost, clearGlobalSessionValues, isDraft, gameType } =
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

    initializeHub(hubAddress, gameKey, initScreen);

    return () => {
      disconnect();
    };
  }, []);

  const initializeHub = async (address: string, key: string, initialScreen: SpinSessionScreen) => {
    const result = await connect(address);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Koblingsfeil. Bli med på nytt.");
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
      console.log(batch);
      setSelectedBatch(batch);
    });

    setListener("round_text", (roundText: string) => {
      setRoundText(roundText);
    });

    setListener(HubChannel.Error, (_message: string) => {
      if (isHandlingErrorRef.current) return;
      isHandlingErrorRef.current = true;

      displayErrorModal("Tilkoblingen mistet", async () => {
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

const LoadingView = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);

export default SpinGame;
