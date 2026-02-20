import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./joinScreenStyles";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useGlobalSessionProvider } from "../../../common/context/GlobalSessionProvider";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/common/constants/Color";
import { GameEntryMode, GameType } from "@/src/common/constants/Types";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useNavigation, useFocusEffect } from "expo-router";
import Screen from "@/src/common/constants/Screen";
import { moderateScale } from "@/src/common/utils/dimensions";
import { useCallback } from "react";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";

export const JoinScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayInfoModal } = useModalProvider();
  const { setGameEntryMode, setGameKey, setHubAddress, setGameType, setIsHost, setIsDraft } =
    useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const [userInput, setUserInput] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      setGameEntryMode(GameEntryMode.Participant);
      setIsHost(false);
    }, []),
  );

  const handleJoinGame = async () => {
    if (!pseudoId) {
      // TODO -handle
      console.error("Missing pseudo id");
      return;
    }

    if (userInput === "") {
      displayInfoModal("Skriv inn spillkode.", "Mangler");
      return;
    }

    const gameKey = userInput.toLocaleLowerCase();
    console.debug("Trying to join:", gameKey);
    const result = await gameService().joinInteractiveGame(pseudoId, gameKey);
    if (result.isError()) {
      console.warn(result.error);
      displayInfoModal("Spillet finnes ikke eller er startet.");
      return;
    }

    const response = result.value;
    console.debug(response);
    setGameEntryMode(GameEntryMode.Participant);

    console.debug(response);
    setIsDraft(response.is_draft);
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
      <ScreenHeader
        title="Bli med"
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
        backgroundColor={Color.HomeRed}
      />
      <View style={styles.cardWrapper}>
        <Image source={require("@/src/common/assets/images/tero.webp")} style={styles.mascot} resizeMode="contain" />
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(20), paddingRight: moderateScale(10) }}
              name="key"
              size={45}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.input}
              placeholder="SLEM POTET"
              placeholderTextColor={Color.DarkerGray}
              value={userInput}
              onChangeText={(input) => setUserInput(input?.toUpperCase())}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
            <Text style={styles.buttonText}>Bli med</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default JoinScreen;
