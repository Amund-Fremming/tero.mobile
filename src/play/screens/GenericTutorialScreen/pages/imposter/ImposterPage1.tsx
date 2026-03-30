import { GameType } from "@/src/core/constants/Types";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import React from "react";
import SimpleTutorial from "../../components/SimpleTutorial/SimpleTutorial";

const ImposterPage1 = () => {
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(GameType.Imposter);
  return (
    <SimpleTutorial
      accentColor={theme.secondaryColor}
      title="Rollene"
      items={[
        "Alle spillere får det samme hemmelige ordet – unntatt imposteren",
        "Imposteren vet ikke hva ordet er, bare temaet",
        "Målet ditt er å finne ut hvem som er imposteren",
      ]}
    />
  );
};

export default ImposterPage1;
