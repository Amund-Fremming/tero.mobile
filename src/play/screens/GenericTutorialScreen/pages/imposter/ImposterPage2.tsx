import { GameType } from "@/src/core/constants/Types";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import React from "react";
import SimpleTutorial from "../../components/SimpleTutorial/SimpleTutorial";

const ImposterPage2 = () => {
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(GameType.Imposter);
  return (
    <SimpleTutorial
      accentColor={theme.secondaryColor}
      title="Diskusjonen"
      items={[
        "Alle svarer på spørsmål knyttet til det hemmelige ordet",
        "Vær konkret nok til å virke troverdig – men ikke avsløre ordet",
        "Imposteren prøver å blende seg inn uten å bli avslørt",
      ]}
    />
  );
};

export default ImposterPage2;
