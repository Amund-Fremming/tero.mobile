import { NavigationProp, CommonActions } from "@react-navigation/native";
import Screen from "../constants/Screen";

let stackNavigator: NavigationProp<any> | null = null;

export function setStackNavigator(nav: NavigationProp<any>) {
  stackNavigator = nav;
}

export function resetToHomeGlobal() {
  if (!stackNavigator) return;
  stackNavigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: Screen.Home }],
    }),
  );
}
