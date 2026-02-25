import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import styles from "./addPlayersScreenStyles";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { resetToHomeScreen } from "@/src/common/utils/navigation";
import React from "react";
import Color from "@/src/common/constants/Color";
import { Feather } from "@expo/vector-icons";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";

export const AddPlayersScreen = () => {
  const navigation: any = useNavigation();

  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { invokeFunction } = useHubConnectionProvider();
  const { gameKey } = useGlobalSessionProvider();
  const { setScreen, players, setPlayers } = useImposterSessionProvider();

  const [editMode, setEditMode] = React.useState(false);

  const handleGoHome = () => {
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    displayInfoModal("Legg til de som skal være med. Trykk på kortene for å endre navn.", "Hvem er med?");
  };

  const handleNextPressed = async () => {
    ensureNoDuplicates();

    const result = await invokeFunction("AddPlayers", gameKey, players);
    if (result.isError()) {
      console.error("Failed to AddPlayers:", result.error);
      displayErrorModal("Klarte ikke legge til spillere");
      return;
    }

    if (!result.value) {
      console.error("An error occurred on the server. Received false on AddPlayers");
      displayErrorModal("En uventet feil har skjedd, forsøk igjen senere");
      // TODO - return to home?
      return;
    }

    setScreen(ImposterSessionScreen.ActiveLobby);
  };

  const ensureNoDuplicates = () => {
    const seen = new Set();
    for (const name of players) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        displayErrorModal("Alle spillere må ha et navn");
        return;
      }

      if (seen.has(trimmedName)) {
        displayErrorModal("Kan ikke ha duplikat navn");
        return;
      }

      seen.add(trimmedName);
    }
  };

  const handleAddPlayer = () => {
    const newPlayerNumber = players.length + 1;
    setPlayers([...players, `Spiller ${newPlayerNumber}`]);
  };

  const handleDeletePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handlePlayerNameChange = (index: number, newName: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = newName;
    setPlayers(updatedPlayers);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Spillere" onBackPressed={handleGoHome} onInfoPress={handleInfoPressed} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Text style={styles.editButtonText}>{editMode ? "Ferdig" : "Rediger"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playersWrapper}>
          {players.map((player, index) => (
            <View key={index} style={styles.playerCard}>
              {editMode && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePlayer(index)}>
                  <Feather name="x" size={22} color={Color.White} />
                </TouchableOpacity>
              )}
              <Feather name="user" size={28} color={Color.White} />
              <TextInput
                style={styles.playerNameInput}
                value={player}
                onChangeText={(text) => handlePlayerNameChange(index, text)}
                placeholder={`Spiller ${index + 1}`}
                placeholderTextColor={Color.White + "80"}
                selectTextOnFocus={true}
              />
            </View>
          ))}
        </View>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity onPress={handleAddPlayer} style={styles.addButton}>
            <Text style={styles.buttonText}>Ny spiller</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextPressed} style={styles.nextButton}>
            <Text style={styles.buttonText}>Neste</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddPlayersScreen;
