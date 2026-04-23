import { CommonActions, NavigationProp } from "@react-navigation/native";
import Screen from "../constants/Screen";

let stackNavigator: NavigationProp<any> | null = null;

export function setStackNavigator(nav: NavigationProp<any>) {
  stackNavigator = nav;
}

export function navigateGlobal(screen: Screen) {
  if (!stackNavigator) return;
  stackNavigator.dispatch(CommonActions.navigate({ name: screen }));
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

// Crash reset registry — called by GameErrorBoundary on unhandled render errors
type ResetCallback = () => void;
const crashResetCallbacks = new Set<ResetCallback>();

export function registerCrashResetCallback(fn: ResetCallback): () => void {
  crashResetCallbacks.add(fn);
  return () => crashResetCallbacks.delete(fn);
}

export function runCrashResetCallbacks() {
  crashResetCallbacks.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn("Error in crash reset callback:", e);
    }
  });
}
