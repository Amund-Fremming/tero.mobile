import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import { GameEntryMode } from "../Common/constants/Types";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import StartedScreen from "./screens/StartedScreen/StartedScreen";
import { SpinGameScreen } from "./constants/SpinTypes";
import { useNavigation } from "expo-router";
import { useHubConnectionProvider } from "../Common/context/HubConnectionProvider";
import { useModalProvider } from "../Common/context/ModalProvider";
import Screen from "../Common/constants/Screen";

export const SpinGame = () => {
  const { connect, setListener } = useHubConnectionProvider();
  const { gameKey, hubAddress } = useGlobalGameProvider();
  const { gameEntryMode } = useGlobalGameProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const navigation: any = useNavigation();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
    createHubConnection();
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

  const getInitialScreen = (): SpinGameScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return SpinGameScreen.Create;
      case GameEntryMode.Host:
        return SpinGameScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return SpinGameScreen.Lobby;
      default:
        return SpinGameScreen.Lobby;
    }
  };

  switch (screen) {
    case SpinGameScreen.Create:
      return <CreateScreen />;
    case SpinGameScreen.Game:
      return <GameScreen />;
    case SpinGameScreen.Lobby:
      return <LobbyScreen />;
    case SpinGameScreen.Started:
      return <StartedScreen />;
    default:
      return SpinGameScreen.Lobby;
  }
};

export default SpinGame;
