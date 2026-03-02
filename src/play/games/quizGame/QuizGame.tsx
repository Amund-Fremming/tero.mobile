import { createStackNavigator } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { useEffect, useRef } from "react";
import { QuizGameScreen, QuizSession } from "./constants/quizTypes";
import { CreateScreen } from "./screens/CreateScreen/CreateScreen";
import { useQuizSessionProvider } from "./context/QuizGameProvider";
import { GameEntryMode } from "@/src/core/constants/Types";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { HubChannel } from "@/src/core/constants/HubChannel";
import { useNavigation } from "expo-router";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";

const QuizStack = createStackNavigator();

export const QuizGame = () => {
  const outerNavigation: any = useNavigation();
  const innerNavRef = useRef<any>(null);
  const { gameEntryMode, gameKey, hubName, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setQuizSession, setIterations, clearQuizGameValues } = useQuizSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal } = useModalProvider();

  useEffect(() => {
    if (!gameKey) return;
    if (gameEntryMode === GameEntryMode.Host) return;

    initializeHub(gameKey, hubName);

    return () => {
      disconnect();
    };
  }, [gameKey]);

  const initializeHub = async (key: string, hub: string) => {
    const result = await connect(hub);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    setupListeners();

    const connectResult = await invokeFunction("ConnectToGroup", key);
    if (connectResult.isError()) {
      displayErrorModal("Du har mistet tilkoblingen, forsøk å bli med på nytt");
      await disconnect();
      return;
    }
  };

  const setupListeners = () => {
    setListener(HubChannel.Iterations, (count: number) => {
      setIterations(count);
    });

    setListener(HubChannel.Error, (message: string) => {
      disconnect();
      clearQuizGameValues();
      clearGlobalSessionValues();
      displayErrorModal(message, () => resetToHomeScreen(outerNavigation));
    });

    setListener(HubChannel.Game, (game: QuizSession) => {
      setQuizSession(game);
    });

    setListener(HubChannel.State, (_message: string) => {
      innerNavRef.current?.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: QuizGameScreen.Started }] }),
      );
      disconnect();
    });
  };

  const getInitialScreen = (): QuizGameScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return QuizGameScreen.Create;
      case GameEntryMode.Host:
        return QuizGameScreen.Game;
      case GameEntryMode.Participant:
      case GameEntryMode.Member:
        return QuizGameScreen.Lobby;
      default:
        return QuizGameScreen.Lobby;
    }
  };

  const initialRoute = getInitialScreen();

  return (
    <QuizStack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <QuizStack.Screen name={QuizGameScreen.Create}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return <CreateScreen />;
        }}
      </QuizStack.Screen>
      <QuizStack.Screen name={QuizGameScreen.Game}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return <GameScreen />;
        }}
      </QuizStack.Screen>
      <QuizStack.Screen name={QuizGameScreen.Lobby}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return <LobbyScreen />;
        }}
      </QuizStack.Screen>
      <QuizStack.Screen name={QuizGameScreen.Started}>
        {({ navigation }) => {
          innerNavRef.current = navigation;
          return <StartedScreen />;
        }}
      </QuizStack.Screen>
    </QuizStack.Navigator>
  );
};

export default QuizGame;
