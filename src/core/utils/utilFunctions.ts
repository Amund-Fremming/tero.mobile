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

/**
 * Resets the navigation stack and navigates to the Home screen.
 * This ensures the navigation stack is cleared, preventing layers from accumulating
 * and avoiding race conditions when starting new games.
 *
 * @param navigation - The navigation object from useNavigation hook
 */
export const resetToHomeScreen = (navigation: NavigationProp<any>) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: Screen.Home }],
    }),
  );
};
