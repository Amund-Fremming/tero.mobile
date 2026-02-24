import { useEffect, useRef, useState } from "react";
import { useGlobalSessionProvider } from "../common/context/GlobalSessionProvider";
import { ImposterSession, ImposterSessionScreen } from "./constants/imposterTypes";
import { GameEntryMode } from "../common/constants/Types";
import { useImposterSessionProvider } from "./context/ImposterSessionProvider";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";
import { useModalProvider } from "../common/context/ModalProvider";
import { resetToHomeScreen } from "../common/utils/navigation";
import { useHubConnectionProvider } from "../common/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { useAuthProvider } from "../common/context/AuthProvider";
import { HubChannel } from "../common/constants/HubChannel";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import AddPlayersScreen from "./screens/AddPlayersScreen/AddPlayersScreen";

export const ImposterGame = () => {
  const navigation: any = useNavigation();
  const { screen, setScreen, clearImposterSessionValues, setIterations, setSession } = useImposterSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameEntryMode, hubAddress, gameKey, setIsHost, clearGlobalSessionValues, isHost, isDraft, gameType } =
    useGlobalSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { pseudoId } = useAuthProvider();

  const isHandlingErrorRef = useRef(false);

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);

    if (initScreen === ImposterSessionScreen.Create) {
      return;
    }

    initializeHub(hubAddress, gameKey, initScreen);

    return () => {
      disconnect();
    };
  }, []);

  const initializeHub = async (address: string, key: string, initialScreen: ImposterSessionScreen) => {
    const result = await connect(address);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Koblingsfeil. Bli med på nytt.");
      return;
    }

    setupListeners();

    const groupResult = await invokeFunction("ConnectToGroup", key);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Kunne ikke koble til.");
      return;
    }

    setScreen(initialScreen);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });

    setListener("session", async (session: ImposterSession) => {
      setSession(session);
      setScreen(ImposterSessionScreen.Game);
    });

    setListener("signal_start", async (_value: boolean) => {
      if (!isHost) {
        await disconnect();
        setScreen(ImposterSessionScreen.Started);
        return;
      }
    });

    setListener(HubChannel.Error, (message: string) => {
      if (isHandlingErrorRef.current) return;
      isHandlingErrorRef.current = true;

      displayErrorModal(message, async () => {
        await resetSessionAndNavigateHome();
      });
    });

    setListener(HubChannel.Iterations, (count: number) => {
      setIterations(count);
    });
  };

  const resetSessionAndNavigateHome = async () => {
    await disconnect();
    clearImposterSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(navigation);
  };

  const getInitialScreen = (): ImposterSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return ImposterSessionScreen.Create;
      case GameEntryMode.Host:
        return ImposterSessionScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return ImposterSessionScreen.ActiveLobby;
      default:
        return ImposterSessionScreen.ActiveLobby;
    }
  };

  switch (screen) {
    case ImposterSessionScreen.Create:
      return (
        <CreateScreen onGameCreated={(address, key) => initializeHub(address, key, ImposterSessionScreen.AddPlayers)} />
      );
    case ImposterSessionScreen.Game:
      return <GameScreen />;
    case ImposterSessionScreen.ActiveLobby:
      return <ActiveLobbyScreen />;
    case ImposterSessionScreen.Started:
      return <StartedScreen />;
    case ImposterSessionScreen.AddPlayers:
      return <AddPlayersScreen />;
    default:
      return <ActiveLobbyScreen />;
  }
};

export default ImposterGame;
