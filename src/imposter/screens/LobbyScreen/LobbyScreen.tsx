import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { HubChannel } from "@/src/common/constants/HubChannel";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/common/constants/Types";
import SimpleInitScreen from "@/src/common/screens/SimpleInitScreen/SimpleInitScreen";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import Color from "@/src/common/constants/Color";
import { resetToHomeScreen } from "@/src/common/utils/navigation";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { connect, setListener, invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, hubAddress, setIsHost, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues, setScreen, iterations } = useImposterSessionProvider();

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
    setScreen(ImposterSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    setScreen(ImposterSessionScreen.AddPlayers);
    // await disconnect();
    // clearGlobalSessionValues();
    // clearImposterSessionValues();
    // resetToHomeScreen(navigation);
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
