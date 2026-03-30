import { GameType } from "@/src/core/constants/Types";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import React from "react";
import SimpleTutorial from "../../components/SimpleTutorial/SimpleTutorial";

const ImposterPage3 = () => {
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(GameType.Imposter);
  return (
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
};

export default ImposterPage3;
