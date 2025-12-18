import { Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import Color from "@/src/Common/constants/Color";
import { Feather } from "@expo/vector-icons";
import { CreateGameRequest, GameCategory, GameEntryMode, GameType } from "@/src/Common/constants/Types";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { styles } from "./createScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import Screen from "@/src/Common/constants/Screen";
import { useNavigation } from "expo-router";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinGameProvider } from "../../context/SpinGameProvider";

const CATEGORY_OPTIONS = [
  { label: "Standard", value: GameCategory.Default },
  { label: "Tilfeldig", value: GameCategory.Random },
  { label: "Casual", value: GameCategory.Casual },
  { label: "Damer", value: GameCategory.Ladies },
  { label: "Gutter", value: GameCategory.Boys },
];

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { displayErrorModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubAddress } = useGlobalGameProvider();
  const { setScreen } = useSpinGameProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    description: "",
    category: GameCategory.Random,
  });

  useEffect(() => {
    console.log("Create screen yes");
  }, []);

  const handleCreate = async () => {
    if (loading) return;

    if (!pseudoId) {
      console.error("No pseudo id present");
      // TODO - handle
      return;
    }

    setLoading(true);
    let result = await gameService().createInteractiveGame(pseudoId, GameType.Spin, createRequest);
    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    const gameKey = result.value.game_key;
    const hubAddress = result.value.hub_address;

    console.debug("key:", gameKey);
    console.debug("hubAdress:", hubAddress);

    setGameKey(gameKey);
    setHubAddress(hubAddress);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(SpinSessionScreen.Lobby);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.header}>Opprett spill</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Spillnavn</Text>
          <TextInput
            style={styles.input}
            placeholder="Skriv spillnavn her"
            placeholderTextColor={Color.Gray}
            value={createRequest.name}
            onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, name: input }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Beskrivelse</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Skriv en beskrivelse"
            placeholderTextColor={Color.Gray}
            value={createRequest.description}
            multiline
            numberOfLines={3}
            onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, description: input }))}
          />
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Velg kategori</Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_OPTIONS.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  createRequest.category === category.value && styles.categoryButtonSelected,
                ]}
                onPress={() => setCreateRequest((prev) => ({ ...prev, category: category.value }))}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    createRequest.category === category.value && styles.categoryButtonTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Feather name="plus-circle" size={24} color={Color.White} />
          <Text style={styles.createButtonText}>Opprett spill</Text>
        </TouchableOpacity>

        <AbsoluteHomeButton />
      </View>
    </ScrollView>
  );
};

export default CreateScreen;
