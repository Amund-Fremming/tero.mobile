/**
 * Wraps game screens to catch JS crashes during render.
 * On crash: resets the nav stack back to HomeScreen via resetToHomeGlobal().
 * Needed because games use their own internal screen-switcher (switch on state),
 * so a crash can leave the user stuck on a broken screen with no way out.
 *
 * Usage: wrapped around each game in Hub.tsx via withErrorBoundary().
 */
import React, { Component, ErrorInfo, ReactNode } from "react";
import { resetToHomeGlobal } from "@/src/core/utils/navigationRef";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GameErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("GameErrorBoundary caught:", error, info);
    resetToHomeGlobal();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
