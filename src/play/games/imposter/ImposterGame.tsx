import { HubChannel } from "@/src/core/constants/HubChannel";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import { useHubConnectionProvider } from "../../context/HubConnectionProvider";
import { ImposterSession, ImposterSessionScreen } from "./constants/imposterTypes";
import { useImposterSessionProvider } from "./context/ImposterSessionProvider";
import AddPlayersScreen from "./screens/AddPlayersScreen/AddPlayersScreen";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import RevealScreen from "./screens/RevealScreen/RevealScreen";
import RoundInstructionsScreen from "./screens/RoundInstructionsScreen/RoundInstructionsScreen";
import { RolesScreen } from "./screens/RolesScreen/RolesScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import TutorialScreen from "./screens/TutorialScreen/TutorialScreen";

export const ImposterGame = () => {
  const outerNavigation: any = useNavigation();
  const { clearImposterSessionValues, setIterations, setImposterSession, screen, setScreen } =
    useImposterSessionProvider();
  const { displayErrorModal } = useModalProvider();
  const { gameEntryMode, sessionData: sessionData, setIsHost, clearGlobalSessionValues, isHost } = useGlobalSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { pseudoId } = useAuthProvider();

  const isHandlingErrorRef = useRef(false);

  useEffect(() => {
    const initScreen = getInitialScreen();
    if ([GameEntryMode.Member, GameEntryMode.Participant].includes(gameEntryMode)) {
      setIsHost(false);
    }
    setScreen(initScreen);
    if (
      initScreen !== ImposterSessionScreen.Create &&
      [GameEntryMode.Member, GameEntryMode.Participant].includes(gameEntryMode)
    ) {
      initializeHub(sessionData.hubName, sessionData.gameKey, initScreen);
    }

    return () => {
      disconnect();
      clearImposterSessionValues();
      clearGlobalSessionValues();
    };
  }, []);

  const initializeHub = async (hubName: string, key: string, targetScreen: ImposterSessionScreen) => {
    const result = await connect(hubName);
    if (result.isError()) {
      console.warn(hubName);
      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt", () => {
        clearGlobalSessionValues();
        clearImposterSessionValues();
        disconnect();
        resetToHomeScreen(outerNavigation);
      });
      return;
    }

    setupListeners();

    const groupResult = await invokeFunction("ConnectToGroup", key);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Kunne ikke koble til.");
      return;
    }

    console.debug("Hub conenction established");
    setScreen(targetScreen);
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
    resetToHomeScreen(outerNavigation);
  };

  const getInitialScreen = (): ImposterSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return ImposterSessionScreen.Tutorial;
      case GameEntryMode.Host:
        return ImposterSessionScreen.AddPlayers;
      case GameEntryMode.Participant:
      case GameEntryMode.Member:
        return ImposterSessionScreen.ActiveLobby;
      default:
        return ImposterSessionScreen.ActiveLobby;
    }
  };

  switch (screen) {
    case ImposterSessionScreen.Tutorial:
      return (
        <TutorialScreen
          onGameCreated={(address, key) => initializeHub(address, key, ImposterSessionScreen.AddPlayers)}
        />
      );
    case ImposterSessionScreen.AddPlayers:
      return <AddPlayersScreen />;
    case ImposterSessionScreen.ActiveLobby:
      return <LobbyScreen />;
    case ImposterSessionScreen.Roles:
      return <RolesScreen />;
    case ImposterSessionScreen.RoundInstructions:
      return <RoundInstructionsScreen />;
    case ImposterSessionScreen.Reveal:
      return <RevealScreen />;
    case ImposterSessionScreen.Create:
      return <CreateScreen />;
    case ImposterSessionScreen.Started:
    default:
      return <StartedScreen />;
  }
};

export default ImposterGame;
