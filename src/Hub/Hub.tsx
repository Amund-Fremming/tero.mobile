import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import Color from "../core/constants/Color";

import { GameErrorBoundary } from "../core/components/GameErrorBoundary/GameErrorBoundary";
import Screen from "../core/constants/Screen";
import DefuserGame from "../play/games/defuser/DefuserGame";
import DiceGame from "../play/games/dice/DiceGame";
import GuessGame from "../play/games/guess/GuessGame";
import ImposterGame from "../play/games/imposter/ImposterGame";
import QuizGame from "../play/games/quiz/QuizGame";
import SpinGame from "../play/games/spin/SpinGame";
import GameListScreen from "../play/screens/GameListScreen/GameListScreen";
import GameTypeListScreen from "../play/screens/GameTypeListScreen/GameTypeListScreen";
import { TipsUsScreen } from "../play/screens/TipsUsScreen/TipsUsScreen";
import AdminScreen from "./screens/AdminScreen/AdminScreen";
import EditProfileScreen from "./screens/EditProfileScreen/EditProfileScreen";
import { ErrorScreen } from "./screens/ErrorScreen/ErrorScreen";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import HubScreen from "./screens/HubScreen/HubScreen";
import JoinScreen from "./screens/JoinScreen/JoinScreen";
import LogsScreen from "./screens/LogsScreen/LogsScreen";
import { ProblemScreen } from "./screens/ProblemScreen/ProblemScreen";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import { SavedGamesScreen } from "./screens/SavedGamesScreen/SavedGamesScreen";
import { TipsListScreen } from "./screens/TipsListScreen/TipsListScreen";

const withErrorBoundary = (GameComponent: React.ComponentType) => () => (
  <GameErrorBoundary>
    <GameComponent />
  </GameErrorBoundary>
);

const SafeSpinGame = withErrorBoundary(SpinGame);
const SafeQuizGame = withErrorBoundary(QuizGame);
const SafeDiceGame = withErrorBoundary(DiceGame);
const SafeImposterGame = withErrorBoundary(ImposterGame);
const SafeDefuserGame = withErrorBoundary(DefuserGame);

const Stack = createStackNavigator();

export const Hub = () => {
  return (
    <Stack.Navigator
      initialRouteName={Screen.Home}
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
        cardStyle: { backgroundColor: Color.White },
      }}
    >
      <Stack.Screen name={Screen.Home} component={HomeScreen} />
      <Stack.Screen name={Screen.Profile} component={ProfileScreen} />
      <Stack.Screen name={Screen.EditProfile} component={EditProfileScreen} />
      <Stack.Screen name={Screen.Hub} component={HubScreen} />
      <Stack.Screen name={Screen.Join} component={JoinScreen} />
      <Stack.Screen name={Screen.Spin} component={SafeSpinGame} />
      <Stack.Screen name={Screen.Quiz} component={SafeQuizGame} />
      <Stack.Screen name={Screen.Dice} component={SafeDiceGame} />
      <Stack.Screen name={Screen.Defuser} component={SafeDefuserGame} />
      <Stack.Screen name={Screen.Imposter} component={SafeImposterGame} />
      <Stack.Screen name={Screen.GameList} component={GameListScreen} />
      <Stack.Screen name={Screen.GameTypeList} component={GameTypeListScreen} />
      <Stack.Screen name={Screen.Admin} component={AdminScreen} />
      <Stack.Screen name={Screen.Logs} component={LogsScreen} />
      <Stack.Screen name={Screen.SavedGames} component={SavedGamesScreen} />
      <Stack.Screen name={Screen.TipsUs} component={TipsUsScreen} />
      <Stack.Screen name={Screen.Error} component={ErrorScreen} />
      <Stack.Screen name={Screen.Problem} component={ProblemScreen} />
      <Stack.Screen name={Screen.TipsList} component={TipsListScreen} />
      <Stack.Screen name={Screen.Guess} component={GuessGame} />
    </Stack.Navigator>
  );
};

export default Hub;
