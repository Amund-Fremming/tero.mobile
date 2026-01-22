import { View, Text, TouchableOpacity } from "react-native";

import styles from "./joinScreenStyles";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useGlobalSessionProvider } from "../../../Common/context/GlobalSessionProvider";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/Common/constants/Color";
import { GameEntryMode, GameType } from "@/src/Common/constants/Types";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "expo-router";
import Screen from "@/src/Common/constants/Screen";
import { moderateScale } from "@/src/Common/utils/dimensions";

export const JoinScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayInfoModal } = useModalProvider();
  const { setGameEntryMode, setGameKey, setHubAddress, setGameType, setIsHost } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const [userInput, setUserInput] = useState<string>("");

  useEffect(() => {
    setGameEntryMode(GameEntryMode.Participant);
    setIsHost(false);
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

    console.log("Received hub address:", response.hub_address);
    setHubAddress(response.hub_address);
    setGameKey(response.game_key);
    setGameType(response.game_type);

    if ([GameType.Duel, GameType.Roulette].includes(response.game_type)) {
      navigation.navigate(Screen.Spin);
      return;
    }

    navigation.navigate(response.game_type);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <Text style={styles.header}></Text>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.header}>Rom navn:</Text>
        <View style={styles.inputWrapper}>
          <Feather
            style={{ paddingLeft: moderateScale(20), paddingRight: moderateScale(10) }}
            name="key"
            size={45}
            color={Color.OffBlack}
          />
          <TextInput
            style={styles.input}
            placeholder="SLEM POTET"
            value={userInput}
            onChangeText={(input) => setUserInput(input?.toUpperCase())}
          />
        </View>
        <View style={styles.inputBorder} />
        <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
          <Text style={styles.buttonText}>Bli med</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinScreen;
