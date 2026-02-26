import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { HubChannel } from "@/src/core/constants/HubChannel";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/core/constants/Types";
import SimpleInitScreen from "@/src/play/screens/SimpleInitScreen/SimpleInitScreen";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import Color from "@/src/core/constants/Color";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const { invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal, displayActionModal } = useModalProvider();
  const { gameKey, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, iterations, clearImposterSessionValues } = useImposterSessionProvider();

  const [round, setRound] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);

  const handleSetRound = (value: string) => {
    setRound(value);
  };

  const handleAddRound = async () => {
    if (round === "") {
      return;
    }

    const result = await invokeFunction("AddRound", gameKey, round);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke legge til runde.");
      return;
    }

    setRound("");
  };

  const handleStartGame = async () => {
    if (started) {
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", gameKey);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Kunne ikke starte spillet.");
      setStarted(false);
      return;
    }

    await disconnect();
    setScreen(ImposterSessionScreen.Roles);
  };

  const handleBackPressed = async () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      async () => {
        await disconnect();
        clearGlobalSessionValues();
        clearImposterSessionValues();
        resetToHomeScreen(navigation);
      },
      () => {},
    );
  };

  const handleInfoPressed = () => {
    displayInfoModal(
      "Del rom navnet med en venn. Legg til ord eller kategorier som skal brukes per runde.",
      "Spillord!",
    );
  };

  return (
    <SimpleInitScreen
      createScreen={false}
      themeColor={Color.BuzzifyLavender}
      secondaryThemeColor={Color.BuzzifyLavenderLight}
      onBackPressed={handleBackPressed}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      topButtonText="Velg kategori"
      topButtonOnChange={() => {}}
      topButtonOnPress={handleAddRound}
      bottomButtonText="Start spill"
      bottomButtonCallback={handleStartGame}
      featherIcon={"users"}
      iterations={iterations}
      inputPlaceholder="Runde ord..."
      inputValue={round}
      setInput={handleSetRound}
    />
  );
};

export default LobbyScreen;
