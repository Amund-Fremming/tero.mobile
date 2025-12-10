import { Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
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

const CATEGORY_OPTIONS = [
  { label: "Standard", value: GameCategory.Default },
  { label: "Tilfeldig", value: GameCategory.Random },
  { label: "Casual", value: GameCategory.Casual },
  { label: "Damer", value: GameCategory.Ladies },
  { label: "Gutter", value: GameCategory.Boys },
];

export const CreateScreen = ({ navigation }: any) => {
  const { displayErrorModal } = useModalProvider();
  const { pseudoId, accessToken } = useAuthProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode } = useGlobalGameProvider();
  const {} = useHubConnectionProvider();

  const [request, setRequest] = useState<CreateGameRequest>({
    name: "",
    category: GameCategory.Default,
  });

  const handleCreate = async () => {
    if (!pseudoId) {
      console.error("No pseudo id present");
      // TODO - handle
      return;
    }

    let result = await gameService().createInteractiveGame(pseudoId, GameType.Spin, request);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    const gameKey = result.value.game_key;
    const hubAddress = result.value.hub_address;

    // DEBUG
    console.debug("key:", gameKey);
    console.debug("hubAdress:", hubAddress);

    // HER
    setGameKey(gameKey);
    setGameEntryMode(GameEntryMode.Creator);

    navigation.navigate(Screen.Spin);
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
            value={request.name}
            onChangeText={(input) => setRequest((prev) => ({ ...prev, name: input }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Beskrivelse</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Skriv en beskrivelse"
            placeholderTextColor={Color.Gray}
            value={request.description}
            multiline
            numberOfLines={3}
            onChangeText={(input) => setRequest((prev) => ({ ...prev, description: input }))}
          />
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Velg kategori</Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_OPTIONS.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[styles.categoryButton, request.category === category.value && styles.categoryButtonSelected]}
                onPress={() => setRequest((prev) => ({ ...prev, category: category.value }))}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    request.category === category.value && styles.categoryButtonTextSelected,
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
