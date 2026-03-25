import { HubChannel } from "@/src/core/constants/HubChannel";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import { useHubConnectionProvider } from "../../context/HubConnectionProvider";
import { GuessSessionScreen, GuessGameState as GuessSessionState } from "./constants/GuessTypes";
import { useGuessSessionProvider } from "./context/GuessGameProvider";
import TutorialScreen from "./screens/TutorialScreen/TutorialScreen";

export const GuessGame = () => {
  const outerNavigation: any = useNavigation();

  const { screen, setScreen, clearGuessSessionValues, setPlayers, setIterations } = useGuessSessionProvider();
  const { disconnect, connect, invokeFunction, setListener } = useHubConnectionProvider();
  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { displayErrorModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  const [hubReady, setHubReady] = useState<boolean>(false);

  useEffect(() => {
    setScreen(GuessSessionScreen.Tutorial);
  }, []);

  const handleLeavePressed = async () => {
    await disconnect();
    clearGuessSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(outerNavigation);
  };

  const initializeHub = async (hubName: string, key: string) => {
    const result = await connect(hubName);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt", () => {
        clearGuessSessionValues();
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
      // TODO GET STATE THEN RENDER SCREEN
      return;
    }
    setHubReady(true);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      //setIsHost(pseudoId === hostId);
    });

    setListener("signal_start", (_value: boolean) => {
      //setScreen(SpinSessionScreen.Game);
    });

    setListener(HubChannel.State, async (state: GuessSessionState) => {
      //setGameState(state);
      //   if (state === SpinGameState.Finished) {
      //     if (gameEntryMode === GameEntryMode.Creator) {
      //       setScreen(SpinSessionScreen.Create);
      //     } else if (gameEntryMode === GameEntryMode.Host) {
      //       // Do nothing
      //     } else {
      //       await disconnect();
      //       setScreen(SpinSessionScreen.Finished);
      //     }
      //   }
    });

    setListener(HubChannel.Error, (message: string) => {
      //   if (isHandlingErrorRef.current) return;
      //   isHandlingErrorRef.current = true;
      //   displayErrorModal(message, async () => {
      //     await handleLeavePressed();
      //   });
    });

    setListener("players_count", (count: number) => {
      setPlayers(count);
    });

    setListener(HubChannel.Iterations, (count: number) => {
      setIterations(count);
    });
  };

  switch (screen) {
    case GuessSessionScreen.Tutorial:
      return <TutorialScreen initializeHub={(a, k) => initializeHub(a, k)} />;
    case GuessSessionScreen.Finished:
    case GuessSessionScreen.ActiveLobby:
    case GuessSessionScreen.Create:
    case GuessSessionScreen.Guess:
    case GuessSessionScreen.PassiveLobby:
    case GuessSessionScreen.Result:
    case GuessSessionScreen.Waiting:
  }
};

export default GuessGame;
