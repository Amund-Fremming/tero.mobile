import React, { useEffect, useState } from "react";
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
  const { gameEntryMode, hubAddress, gameKey, setIsHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { screen, setScreen, setRoundText, setSelectedBatch, setGameState, setIterations, setPlayers } =
    useSpinSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();
  const { clearSpinSessionValues } = useSpinSessionProvider();

  const [hubReady, setHubReady] = useState<boolean>(false);

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);

    if (initScreen === SpinSessionScreen.Create) {
      return;
    }

    initializeHub(hubAddress, gameKey);

    return () => {
      disconnect();
    };
  }, []);

  const initializeHub = async (address: string, key: string) => {
    const result = await connect(address);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      return;
    }

    setupListeners();

    const groupResult = await invokeFunction("ConnectToGroup", key, pseudoId, false);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Klarte ikke koble til, forsøk å lukke appen og start på nytt");
      return;
    }

    setHubReady(true);
    setScreen(SpinSessionScreen.ActiveLobby);
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
      displayErrorModal(message, async () => {
        await disconnect();
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
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return SpinSessionScreen.Create;
      case GameEntryMode.Host:
        return SpinSessionScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        // TODO: Initially render PassiveLobbyScreen, then redirect to ActiveLobbyScreen
        return SpinSessionScreen.ActiveLobby;
      default:
        return SpinSessionScreen.ActiveLobby;
    }
  };

  switch (screen) {
    case SpinSessionScreen.Create:
      return <CreateScreen onGameCreated={(address, key) => initializeHub(address, key)} />;
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
