import { Text, TouchableOpacity, View } from "react-native";
import styles from "./createScreenStyles";
import { useState } from "react";
import { CreateGameRequest, GameCategory, GameEntryMode, GameType } from "@/src/Common/constants/Types";
import { TextInput } from "react-native-gesture-handler";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "expo-router";
import { QuizGameScreen as QuizSessionScreen } from "../../constants/quizTypes";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";
import Color from "@/src/Common/constants/Color";
import CategoryDropdown from "@/src/Common/components/CategoryDropdown/CategoryDropdown";
import SimpleInitScreen from "@/src/Common/screens/SimpleInitScreen/SimpleInitScreen";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubAddress } = useGlobalSessionProvider();
  const { setScreen } = useQuizGameProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.4);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    category: "" as any,
  });

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
    const result = await gameService().createInteractiveGame(pseudoId, GameType.Quiz, createRequest);

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameKey(result.value.key);
    setHubAddress(result.value.hub_address);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(QuizSessionScreen.Lobby);
    setLoading(false);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <SimpleInitScreen
      themeColor={Color.BuzzifyLavender}
      secondaryThemeColor={Color.BuzzifyLavenderLight}
      onBackPressed={() => navigation.goBack()}
      headerText="Opprett"
      topButtonText="Velg kategori"
      topButtonCallback={handleSetCategory}
      bottomButtonText="Opprett"
      bottomButtonCallback={handleCreateGame}
      featherIcon="layers"
      iterations={"?"}
      inputPlaceholder="Spillnavn..."
      inputValue={createRequest.name}
      setInput={handleSetName}
    />
  );
};
