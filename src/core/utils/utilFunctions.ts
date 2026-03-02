import { CommonActions, NavigationProp } from "@react-navigation/native";
import Screen from "../constants/Screen";

export function getHeaders(pseudo_id: string, token: string | null): Record<string, string> {
  if (!token) {
    return {
      "X-Guest-Authentication": pseudo_id,
    };
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const resetToHomeScreen = (navigation: NavigationProp<any>) => {
  if (!navigation) return;

  let root: any = navigation;
  while (root.getParent?.()) {
    root = root.getParent();
  }

  root.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: Screen.Home }],
    }),
  );
};
