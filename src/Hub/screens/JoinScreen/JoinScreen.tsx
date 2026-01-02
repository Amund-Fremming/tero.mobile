import { View, Text, TouchableOpacity } from "react-native";

import styles from "./joinScreenStyles";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useGlobalSessionProvider } from "../../../Common/context/GlobalSessionProvider";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/Common/constants/Color";
import { GameEntryMode } from "@/src/Common/constants/Types";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "expo-router";

export const JoinScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayInfoModal } = useModalProvider();
  const { setGameEntryMode, setGameKey, setHubAddress } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const [userInput, setUserInput] = useState<string>("");

  useEffect(() => {
    setGameEntryMode(GameEntryMode.Participant);
  }, []);

  const handleJoinGame = async () => {
    if (!pseudoId) {
      // TODO -handle
      console.error("Missing pseudo id");
      return;
    }

    if (userInput === "") {
      displayInfoModal("Du har glemt å skrive inn en spill id i tekstfeltet", "Oisann");
      return;
    }

    const gameKey = userInput.toLocaleLowerCase();
    console.debug("Trying to join:", gameKey);
    const result = await gameService().joinInteractiveGame(pseudoId, gameKey);
    if (result.isError()) {
      console.error(result.error);
      displayInfoModal("Spillet har startet eller finnes ikke");
      return;
    }

    const response = result.value;
    console.debug(response);
    setGameEntryMode(GameEntryMode.Participant);
    setHubAddress(response.hub_address);
    setGameKey(response.game_key);
    navigation.navigate(response.game_type);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.goBack} onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={36} color={Color.OffBlack} />
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.header}>Skriv in kodeordet</Text>
        <View style={styles.inputWrapper}>
          <Feather name="key" size={30} color={Color.OffBlack} />
          <TextInput
            style={styles.input}
            placeholder="SLEM POTET"
            value={userInput}
            onChangeText={(input) => setUserInput(input?.toUpperCase())}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
          <Text style={styles.buttonText}>Bli med</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinScreen;
