import { GameType } from "@/src/core/constants/Types";
import { getGameTheme } from "@/src/play/config/gameTheme";
import React from "react";
import SimpleTutorial from "../../components/SimpleTutorial";

const theme = getGameTheme(GameType.Imposter);

const ImposterPage1 = () => (
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

export default ImposterPage1;
