import React, { useEffect, useState, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
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

const SpinStack = createStackNavigator();

export const SpinGame = () => {
  const outerNavigation: any = useNavigation();
  const innerNavRef = useRef<any>(null);
  const { gameEntryMode, hubName, gameKey, setIsHost, clearGlobalSessionValues, isDraft, gameType } =
    useGlobalSessionProvider();
  const {
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

  const navigateInner = (screenName: string) => {
    innerNavRef.current?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: screenName }] }));
  };

  const resetSessionAndNavigateHome = async () => {
    await disconnect();
    clearSpinSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(outerNavigation);
  };

  useEffect(() => {
    setThemeColors(gameType);

    const initScreen = getInitialScreen();
    if (initScreen !== SpinSessionScreen.Create) {
      initializeHub(hubName, gameKey, initScreen);
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
    navigateInner(targetScreen);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });

    setListener("signal_start", (_value: boolean) => {
      navigateInner(SpinSessionScreen.Game);
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

  const initialRoute = getInitialScreen();

  return (
    <SpinStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <SpinStack.Screen name={SpinSessionScreen.Create}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return <CreateScreen onGameCreated={(a, k) => initializeHub(a, k, SpinSessionScreen.ActiveLobby)} />;
        }}
      </SpinStack.Screen>
      <SpinStack.Screen name={SpinSessionScreen.ActiveLobby}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return hubReady ? <ActiveLobbyScreen /> : <LoadingView />;
        }}
      </SpinStack.Screen>
      <SpinStack.Screen name={SpinSessionScreen.PassiveLobby}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return hubReady ? <PassiveLobbyScreen /> : <LoadingView />;
        }}
      </SpinStack.Screen>
      <SpinStack.Screen name={SpinSessionScreen.Game}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return hubReady ? <GameScreen /> : <LoadingView />;
        }}
      </SpinStack.Screen>
    </SpinStack.Navigator>
  );
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
