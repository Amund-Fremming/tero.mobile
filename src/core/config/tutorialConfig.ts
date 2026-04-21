import { GameType } from "@/src/core/constants/Types";

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
      "Opprett spill, og del rom navnet med venner",
      "Venner blir med ved å trykke bli med på hjem skjermen og bruke rom navnet for å bli med",
      "Legg til så mange spørsmål dere ønsker og start spillet",
      "Spill det som 100 spørsmål med noe som kastes rundt, eller send mobilen på rundtur og la leseren svare",
    ],
  },
  [GameType.Roulette]: {
    mode: "simple",
    title: "Slik spiller du Roulette",
    items: [
      "Opprett spill, og del rom navnet med venner",
      "Venner blir med ved å trykke bli med på hjem skjermen og bruke rom navnet for å bli med",
      "Legg til en straff, noe taperen må svare på eller gjøre",
      "Hver runde så vil en person bli valgt som taper",
    ],
  },
  [GameType.Duel]: {
    mode: "simple",
    title: "Slik spiller du Duel",
    items: [
      "Opprett spill, og del rom navnet med venner",
      "Venner blir med ved å trykke bli med på hjem skjermen og bruke rom navnet for å bli med",
      "Legg til dueller som de to valgte må utføre",
      "Hjulet velger utfordringen og begge deltagerne",
      "Den som fullfører utfordringen best eller først vinner runden",
    ],
  },
  // Multi-step example:
  // [GameType.Imposter]: {
  //   mode: "multi",
  //   pages: [ImposterPage1, ImposterPage2, ImposterPage3],
  // },
  [GameType.Imposter]: {
    mode: "simple",
    title: "Slik spiller du Imposter",
    items: [
      "Start ved å legge til alle som skal være med og deres navn",
      "Legg så til kategorier, eller ord man ofte har assosiasjoner med",
      "Alle spillere får det samme hemmelige ordet – unntatt imposteren",
      "Når runden starter sier man en assosiasjon til ordet som blir valgt",
      "Etter hver runde stemmer man ut den man tror er imposteren"
    ],
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
  [GameType.Defuser]: {
    mode: "simple",
    title: "Slik spiller du Defuser",
    items: [
      "Kutt ledningene til bomben for å dearmere den",
      "Kutter du feil ledning sprenger bomben og du taper",
      "Tapere får taper premien",
    ],
  },
};
