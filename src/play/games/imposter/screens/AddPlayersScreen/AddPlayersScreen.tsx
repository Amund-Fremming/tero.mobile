import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import styles from "./addPlayersScreenStyles";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import React from "react";
import Color from "@/src/core/constants/Color";
import { Feather } from "@expo/vector-icons";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useHubConnectionProvider } from "@/src/play/context/HubConnectionProvider";
import { ImposterSessionScreen } from "../../constants/imposterTypes";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { GameEntryMode } from "@/src/core/constants/Types";

export const AddPlayersScreen = () => {
  const navigation: any = useNavigation();

  const { displayErrorModal, displayInfoModal, displayActionModal } = useModalProvider();
  const { invokeFunction } = useHubConnectionProvider();
  const { gameKey, clearGlobalSessionValues, gameEntryMode } = useGlobalSessionProvider();
  const { setScreen, players, setPlayers, clearImposterSessionValues, setImposterSession } =
    useImposterSessionProvider();

  const [editMode, setEditMode] = React.useState(false);

  const handleGoHome = () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      () => {
        clearGlobalSessionValues();
        clearImposterSessionValues();
        resetToHomeScreen(navigation);
      },
      () => {},
    );
  };

  const handleInfoPressed = () => {
    displayInfoModal("Legg til de som skal være med. Trykk på kortene for å endre navn.", "Hvem er med?");
  };

  const handleNextPressed = async () => {
    if (!ensureNoDuplicates()) {
      return;
    }

    if (players.length < 3) {
      displayInfoModal("Må ha minst 3 spillere for å starte.");
      return;
    }

    const defaultNamePrefixCount = players.filter((name) => name.startsWith("Spiller")).length;
    if (defaultNamePrefixCount === players.length) {
      displayActionModal("Du kan endre spiller navn ved å trykke på kortene. Vil du endre navn?", () => {}, addPlayers);
      return;
    }

    addPlayers();
  };

  const addPlayers = () => {
    if (gameEntryMode === GameEntryMode.Creator) {
      addPlayersToServer();
      setScreen(ImposterSessionScreen.ActiveLobby);
      return;
    }

    if (gameEntryMode === GameEntryMode.Host) {
      addPlayerToProvider();
      setScreen(ImposterSessionScreen.Roles);
      return;
    }
  };

  const addPlayerToProvider = () => {
    setImposterSession((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        players: new Set(players),
      };
    });
  };

  const addPlayersToServer = async () => {
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
  };

  const ensureNoDuplicates = (): boolean => {
    const seen = new Set();
    for (const name of players) {
      const trimmedName = name.trim().toLocaleLowerCase();

      if (!trimmedName) {
        displayErrorModal("Alle spillere må ha et navn");
        return false;
      }

      if (seen.has(trimmedName)) {
        displayErrorModal("Kan ikke ha duplikat navn");
        return false;
      }

      seen.add(trimmedName);
    }

    return true;
  };

  const handleAddPlayer = () => {
    const newPlayerNumber = players.length + 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlayers([...players, `Spiller ${newPlayerNumber}`]);
  };

  const handleDeletePlayer = (index: number) => {
    if (players.length <= 3) {
      displayInfoModal("Må ha minst 3 spillere for å spille");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
