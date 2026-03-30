import { useState } from "react";
import GenericTutorialScreen from "../../screens/GenericTutorialScreen/GenericTutorialScreen";
import GameScreen from "./GameScreen/GameScreen";

type DefuserScreen = "tutorial" | "game";

export default function DefuserGame() {
  const [screen, setScreen] = useState<DefuserScreen>("tutorial");

  if (screen === "tutorial") {
    return <GenericTutorialScreen onFinishedPressed={() => setScreen("game")} />;
  }

  return <GameScreen />;
}
