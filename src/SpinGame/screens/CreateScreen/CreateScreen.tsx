import { useEffect, useState } from "react";
import { CreateGameRequest, GameCategory, GameEntryMode } from "@/src/Common/constants/Types";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "expo-router";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import SimpleInitScreen from "@/src/Common/screens/SimpleInitScreen/SimpleInitScreen";

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubAddress, gameType, isHost, setIsHost } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon, setThemeColors } = useSpinGameProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    category: "" as any,
  });

  useEffect(() => {
    setIsHost(true);
  }, []);

  useEffect(() => {
    console.log("GameType=" + gameType);
    setThemeColors(gameType);
  }, [gameType]);

  const handleSetCategory = (value: any) => {
    setCreateRequest((prev) => ({ ...prev, category: value as GameCategory }));
  };

  const handleSetName = (value: string) => {
    setCreateRequest((prev) => ({ ...prev, name: value }));
  };

  const handleCreateGame = async () => {
    if (loading) return;

    if (!createRequest.category) {
      displayInfoModal("Du må velge kategori");
      return;
    }

    if (createRequest.name === "") {
      displayInfoModal("Spillet må ha ett navn");
      return;
    }

    if (!pseudoId) {
      // TODO - handle
      console.error("No pseudo id present");
      displayErrorModal("En feil har skjedd, forsøk å åpne appen på nytt");
      return;
    }

    setLoading(true);
    const result = await gameService().createInteractiveGame(pseudoId, gameType, createRequest);

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameKey(result.value.key);
    setHubAddress(result.value.hub_address);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(SpinSessionScreen.Lobby);
    setLoading(false);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <SimpleInitScreen
      isHost={isHost}
      createScreen={true}
      themeColor={themeColor}
      secondaryThemeColor={secondaryThemeColor}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      topButtonText={createRequest.category}
      topButtonOnChange={handleSetCategory}
      topButtonOnPress={() => {}}
      bottomButtonText="Opprett"
      bottomButtonCallback={handleCreateGame}
      featherIcon={featherIcon}
      iterations={"?"}
      inputPlaceholder="Spillnavn..."
      inputValue={createRequest.name}
      setInput={handleSetName}
    />
  );
};

export default CreateScreen;
