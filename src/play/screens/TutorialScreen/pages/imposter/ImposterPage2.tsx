import { GameType } from "@/src/core/constants/Types";
import { getGameTheme } from "@/src/play/config/gameTheme";
import React from "react";
import SimpleTutorial from "../../components/SimpleTutorial";

const theme = getGameTheme(GameType.Imposter);

const ImposterPage2 = () => (
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

export default ImposterPage2;
