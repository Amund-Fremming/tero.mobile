import { View, Text, TouchableOpacity, Image, Keyboard } from "react-native";
import * as Haptics from "expo-haptics";
import styles from "./joinScreenStyles";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useGlobalSessionProvider } from "../../../play/context/GlobalSessionProvider";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/core/constants/Color";
import { GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useNavigation, useFocusEffect } from "expo-router";
import Screen from "@/src/core/constants/Screen";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useCallback } from "react";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { KeyboardAvoidingWrapper } from "@/src/core/components/KeyboardAvoidingWrapper/KeyboardAvoidingWrapper";

export const JoinScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayInfoModal } = useModalProvider();
  const { setGameEntryMode, setGameKey, setHubName, setGameType, setIsHost, setIsDraft } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();
  const anchorRef = useRef<View>(null);

  const [userInput, setUserInput] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      setGameEntryMode(GameEntryMode.Participant);
      setIsHost(false);
    }, []),
  );

  const handleJoinGame = async () => {
    if (userInput === "") {
      displayInfoModal("Du har glemt å skrive inn ett rom navn.", "Oisann");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const gameKey = userInput.trim().toLocaleLowerCase();
    const result = await gameService().joinInteractiveGame(pseudoId, gameKey);
    if (result.isError()) {
      console.warn(result.error);
      displayInfoModal("Spillet finnes ikke eller har allerede startet.");
      return;
    }

    const response = result.value;
    setGameEntryMode(GameEntryMode.Participant);

    setIsDraft(response.is_draft);
    setHubName(response.hub_name);
    setGameKey(response.game_key);
    setGameType(response.game_type);

    if ([GameType.Duel, GameType.Roulette].includes(response.game_type)) {
      navigation.navigate(Screen.Spin);
      return;
    }

    navigation.navigate(response.game_type);
  };

  const handleInfoPressed = () => {
    displayInfoModal(
      "Få romnavnet fra spillverten, skriv det inn i feltet, og trykk 'Bli med' for å delta!",
      "Hvordan?",
    );
  };

  return (
    <KeyboardAvoidingWrapper backgroundColor={Color.LightGray} anchorRef={anchorRef}>
      <View style={styles.container}>
        <ScreenHeader
          title="Bli med"
          onBackPressed={() => navigation.goBack()}
          onInfoPress={handleInfoPressed}
          backgroundColor={Color.BuzzifyLavender}
        />
        <View style={styles.cardWrapper}>
          <Image source={require("@/src/core/assets/images/tero.webp")} style={styles.mascot} resizeMode="contain" />
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
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity ref={anchorRef} style={styles.button} onPress={handleJoinGame}>
              <Text style={styles.buttonText}>Bli med</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default JoinScreen;
