import { GameType } from "@/src/core/constants/Types";
import { getGameTheme } from "@/src/play/config/gameTheme";
import React from "react";
import SimpleTutorial from "../../components/SimpleTutorial";

const theme = getGameTheme(GameType.Imposter);

const ImposterPage3 = () => (
  <SimpleTutorial
    accentColor={theme.secondaryColor}
    title="Avsløringen"
    items={[
      "Stem på hvem du tror er imposteren",
      "Hvis imposteren blir stemt ut, får de en siste sjanse til å gjette ordet",
      "Gjetter imposteren riktig, vinner de likevel!",
    ]}
  />
);

export default ImposterPage3;
