import React from "react";
import { GameType } from "../../../core/constants/Types";
import ImposterPage1 from "./pages/imposter/ImposterPage1";
import ImposterPage2 from "./pages/imposter/ImposterPage2";
import ImposterPage3 from "./pages/imposter/ImposterPage3";

export type SimpleTutorialDef = {
  mode: "simple";
  title?: string;
  items: string[];
};

export type MultiStepTutorialDef = {
  mode: "multi";
  pages: React.ComponentType[];
};

export type TutorialDef = SimpleTutorialDef | MultiStepTutorialDef;

export const tutorialConfig: Record<GameType, TutorialDef> = {
  [GameType.Quiz]: {
    mode: "simple",
    title: "Slik spiller du Quiz",
    items: [
      "Opprett ett spill med ett navn og en kategori",
      "Del rom navnet til de andre spillerene",
      "Legg til så mange spørsmål dere ønsker og start spillet",
      "Les opp spørsmålet og svar på tur. Her kan dere sende telefonen rundt, eller svare på rundtur",
    ],
  },
  [GameType.Roulette]: {
    mode: "simple",
    title: "Slik spiller du Roulette",
    items: [
      "Opprett ett spill med ett navn og en kategori",
      "Hjulet snurrer og stopper på en tilfeldig spiller",
      "Personen som hjulet lander på må utføre en utfordring",
      "Ingen vet hvem som er neste hold deg klar!",
    ],
  },
  [GameType.Duel]: {
    mode: "simple",
    title: "Slik spiller du Duel",
    items: [
      "To spillere går mot hverandre i en direkte duell",
      "Hjulet velger utfordringen og begge deltagerne",
      "Den som fullfører utfordringen best, vinner runden",
    ],
  },
  [GameType.Imposter]: {
    mode: "multi",
    pages: [ImposterPage1, ImposterPage2, ImposterPage3],
  },
  [GameType.Dice]: {
    mode: "simple",
    title: "Slik spiller du Dice",
    items: [
      "Spillerne kaster terningen på tur",
      "Resultatet avgjør hvilken utfordring du må gjøre",
      "Flaks og mot avgjør hvem som vinner runden",
    ],
  },
};
