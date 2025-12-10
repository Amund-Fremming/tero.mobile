import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { GameEntryMode } from "../Common/constants/Types";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "../Common/context/HubConnectionProvider";
import { useModalProvider } from "../Common/context/ModalProvider";
import { useNavigation } from "expo-router";
import Screen from "../Common/constants/Screen";
import { QuizGameScreen } from "./constants/quizTypes";
import { CreateScreen } from "./screens/CreateScreen/CreateScreen";
import { useQuizGameProvider } from "./context/QuizGameProvider";

export const QuizGame = () => {
  const { connect, setListener } = useHubConnectionProvider();
  const { hubAddress } = useGlobalGameProvider();
  const { gameEntryMode } = useGlobalGameProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { screen, setScreen } = useQuizGameProvider();
  const navigation: any = useNavigation();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
    //createHubConnection();
  }, []);

  const createHubConnection = async () => {
    const result = await connect(hubAddress);
    if (result.isError()) {
      displayErrorModal("Klarte ikke koble deg til spillet");
      return;
    }

    setListener("disconnect", (message: string) => {
      displayInfoModal(message, "Heisann", () => navigation.navigate(Screen.Home));
    });
  };

  const getInitialScreen = (): QuizGameScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return QuizGameScreen.Create;
      case GameEntryMode.Host:
        return QuizGameScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return QuizGameScreen.Lobby;
      default:
        return QuizGameScreen.Lobby;
    }
  };

  switch (screen) {
    case QuizGameScreen.Create:
      return <CreateScreen />;
    case QuizGameScreen.Game:
      return <GameScreen />;
    case QuizGameScreen.Lobby:
      return <LobbyScreen />;
    case QuizGameScreen.Started:
      return <StartedScreen />;
    default:
      return <LobbyScreen />;
  }
};

export default QuizGame;
