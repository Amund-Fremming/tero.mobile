import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TransitionPresets } from "@react-navigation/stack";
import Color from "../Common/constants/Color";

import HomeScreen from "./screens/HomeScreen/HomeScreen";
import SpinGame from "../SpinGame/SpinGame";
import QuizGame from "../quizGame/QuizGame";
import HubScreen from "./screens/HubScreen/HubScreen";
import JoinScreen from "./screens/JoinScreen/JoinScreen";
import Screen from "../Common/constants/Screen";
import AdminScreen from "./screens/AdminScreen/AdminScreen";
import LogsScreen from "./screens/LogsScreen/LogsScreen";
import GameTypeListScreen from "../Common/screens/GameTypeListScreen/GameTypeListScreen";
import GameListScreen from "../Common/screens/GameListScreen/GameListScreen";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen/EditProfileScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen/ChangePasswordScreen";
import { SavedGamesScreen } from "./screens/SavedGamesScreen/SavedGamesScreen";
import { TipsUsScreen } from "../Common/screens/TipsUsScreen/TipsUsScreen";
import { ErrorScreen } from "./screens/ErrorScreen/ErrorScreen";
import { ProblemScreen } from "./screens/ProblemScreen/ProblemScreen";

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
      <Stack.Screen name={Screen.ChangePassword} component={ChangePasswordScreen} />
      <Stack.Screen name={Screen.Hub} component={HubScreen} />
      <Stack.Screen name={Screen.Join} component={JoinScreen} />
      <Stack.Screen name={Screen.Spin} component={SpinGame} />
      <Stack.Screen name={Screen.Quiz} component={QuizGame} />
      <Stack.Screen name={Screen.GameList} component={GameListScreen} />
      <Stack.Screen name={Screen.GameTypeList} component={GameTypeListScreen} />
      <Stack.Screen name={Screen.Admin} component={AdminScreen} />
      <Stack.Screen name={Screen.Logs} component={LogsScreen} />
      <Stack.Screen name={Screen.SavedGames} component={SavedGamesScreen} />
      <Stack.Screen name={Screen.TipsUs} component={TipsUsScreen} />
      <Stack.Screen name={Screen.Error} component={ErrorScreen} />
      <Stack.Screen name={Screen.Problem} component={ProblemScreen} />
    </Stack.Navigator>
  );
};

export default Hub;
