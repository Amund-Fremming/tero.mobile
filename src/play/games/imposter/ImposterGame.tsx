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
import { RolesScreen } from "./screens/RolesScreen/RolesScreen";
import RoundInstructionsScreen from "./screens/RoundInstructionsScreen/RoundInstructionsScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import TutorialScreen from "./screens/TutorialScreen/TutorialScreen";

export const ImposterGame = () => {
  const outerNavigation: any = useNavigation();
  const { clearImposterSessionValues, setIterations, setImposterSession, screen, setScreen } =
    useImposterSessionProvider();
  const { displayErrorModal, displayActionModal } = useModalProvider();
  const {
    gameEntryMode,
    sessionData: sessionData,
    setIsHost,
    clearGlobalSessionValues,
    isHost,
  } = useGlobalSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { pseudoId } = useAuthProvider();

  const isHandlingErrorRef = useRef(false);

  useEffect(() => {
    if (gameEntryMode === GameEntryMode.Participant) {
      setIsHost(false);
    }
    setScreen(ImposterSessionScreen.Tutorial);

    return () => {
      disconnect();
      clearImposterSessionValues();
      clearGlobalSessionValues();
    };
  }, []);

  const initializeHub = async (hubName: string, key: string) => {
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

  const handleLeavePressed = () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      () => {
        clearImposterSessionValues();
        clearGlobalSessionValues();
        resetToHomeScreen(outerNavigation);
        disconnect();
      },
      () => {},
    );
  };

  switch (screen) {
    case ImposterSessionScreen.Tutorial:
      return <TutorialScreen initiateHub={(address, key) => initializeHub(address, key)} />;
    case ImposterSessionScreen.AddPlayers:
      return <AddPlayersScreen onLeave={handleLeavePressed} />;
    case ImposterSessionScreen.ActiveLobby:
      return <LobbyScreen />;
    case ImposterSessionScreen.Roles:
      return <RolesScreen onLeave={handleLeavePressed} />;
    case ImposterSessionScreen.RoundInstructions:
      return <RoundInstructionsScreen />;
    case ImposterSessionScreen.Reveal:
      return <RevealScreen onLeave={handleLeavePressed} />;
    case ImposterSessionScreen.Create:
      return <CreateScreen />;
    case ImposterSessionScreen.Started:
    default:
      return <StartedScreen />;
  }
};

export default ImposterGame;
