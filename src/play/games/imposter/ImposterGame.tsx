import { useEffect, useRef, useState } from "react";
import { ImposterSession, ImposterSessionScreen } from "./constants/imposterTypes";
import { useImposterSessionProvider } from "./context/ImposterSessionProvider";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { RolesScreen } from "./screens/RolesScreen/RolesScreen";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import { useNavigation } from "expo-router";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import AddPlayersScreen from "./screens/AddPlayersScreen/AddPlayersScreen";
import RevealScreen from "./screens/RevealScreen/RevealScreen";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { HubChannel } from "@/src/core/constants/HubChannel";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useHubConnectionProvider } from "../../context/HubConnectionProvider";
import { GameEntryMode } from "@/src/core/constants/Types";

export const ImposterGame = () => {
  const navigation: any = useNavigation();
  const { screen, setScreen, clearImposterSessionValues, setIterations, setImposterSession } =
    useImposterSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameEntryMode, hubName, gameKey, setIsHost, clearGlobalSessionValues, isHost, isDraft, gameType } =
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

    if ([GameEntryMode.Member, GameEntryMode.Participant].includes(gameEntryMode)) {
      initializeHub(hubName, gameKey, initScreen);
    }

    return () => {
      disconnect();
    };
  }, []);

  const initializeHub = async (hubName: string, key: string, initialScreen: ImposterSessionScreen) => {
    const result = await connect(hubName);
    if (result.isError()) {
      console.warn(hubName);
      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt");
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
      setImposterSession(session);
      setScreen(ImposterSessionScreen.Roles);
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
        return ImposterSessionScreen.AddPlayers;
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
    case ImposterSessionScreen.Roles:
      return <RolesScreen />;
    case ImposterSessionScreen.Reveal:
      return <RevealScreen />;
    case ImposterSessionScreen.ActiveLobby:
      return <LobbyScreen />;
    case ImposterSessionScreen.Started:
      return <StartedScreen />;
    case ImposterSessionScreen.AddPlayers:
      return <AddPlayersScreen />;
    default:
      return <LobbyScreen />;
  }
};

export default ImposterGame;
