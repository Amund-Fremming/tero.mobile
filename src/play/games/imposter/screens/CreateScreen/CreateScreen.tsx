import { useCallback, useEffect, useState } from "react";
import { CreateGameRequest, GameCategory, GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useFocusEffect, useNavigation } from "expo-router";
import SimpleInitScreen from "@/src/play/screens/SimpleInitScreen/SimpleInitScreen";
import Color from "@/src/core/constants/Color";

export const CreateScreen = ({
  onGameCreated,
}: {
  onGameCreated: (hubName: string, gameKey: string) => Promise<void>;
}) => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubName, gameType, setIsHost } = useGlobalSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    category: "" as any,
  });

  useFocusEffect(
    useCallback(() => {
      setIsHost(true);
    }, []),
  );

  const handleSetCategory = (value: any) => {
    setCreateRequest((prev) => ({ ...prev, category: value as GameCategory }));
  };

  const handleSetName = (value: string) => {
    setCreateRequest((prev) => ({ ...prev, name: value }));
  };

  const handleCreateGame = async () => {
    if (loading) return;
    const gameName = createRequest.name.trim();

    if (!createRequest.category) {
      displayInfoModal("Velg kategori.");
      return;
    }

    if (gameName === "") {
      displayInfoModal("Spillnavn kan ikke være tomt");
      return;
    }

    if (gameName.length < 3) {
      displayInfoModal("Navn må ha minst 3 tegn.");
      return;
    }

    setLoading(true);
    const result = await gameService().createInteractiveGame(pseudoId, gameType, { ...createRequest, name: gameName });

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameKey(result.value.key);
    setHubName(result.value.hub_name);
    setGameEntryMode(GameEntryMode.Creator);
    await onGameCreated(result.value.hub_name, result.value.key);
    setLoading(false);
  };

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  return (
    <SimpleInitScreen
      createScreen={true}
      themeColor={Color.BuzzifyLavender}
      secondaryThemeColor={Color.BuzzifyLavenderLight}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      topButtonText={createRequest.category}
      topButtonOnChange={handleSetCategory}
      topButtonOnPress={() => {}}
      bottomButtonText="Neste"
      bottomButtonCallback={handleCreateGame}
      featherIcon={"users"}
      iterations={"?"}
      inputPlaceholder="Spillnavn..."
      inputValue={createRequest.name}
      setInput={handleSetName}
    />
  );
};

export default CreateScreen;
