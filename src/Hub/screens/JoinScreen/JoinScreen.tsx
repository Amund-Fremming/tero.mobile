import { KeyboardAvoidingWrapper } from "@/src/core/components/KeyboardAvoidingWrapper/KeyboardAvoidingWrapper";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import Screen from "@/src/core/constants/Screen";
import { GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Image, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useGlobalSessionProvider } from "../../../play/context/GlobalSessionProvider";
import styles from "./joinScreenStyles";

export const JoinScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayInfoModal } = useModalProvider();
  const {
    setGameEntryMode,
    setSessionDataValues: setGameSessionValues,
    setGameType,
    setIsHost,
    setIsDraft,
  } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();
  const anchorRef = useRef<View>(null);

  const [userInput, setUserInput] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      setGameEntryMode(GameEntryMode.Participant);
      setIsHost(false);
    }, []),
  );

  const handleJoinGame = async () => {
    setIsHost(false);
    if (userInput === "") {
      setErrorText("Du har glemt å skrive inn ett rom navn.");
      return;
    }
    setErrorText("");

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const gameKey = userInput.trim().toLocaleLowerCase();
    const result = await gameService().joinInteractiveGame(pseudoId, gameKey);
    if (result.isError()) {
      console.warn(result.error);
      setErrorText("Spillet finnes ikke eller har allerede startet.");
      return;
    }

    const response = result.value;
    setGameEntryMode(GameEntryMode.Participant);

    setIsDraft(response.is_draft);
    setGameSessionValues(response.game_key, response.hub_name, response.game_id);
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
                placeholder="Rom navn"
                placeholderTextColor={Color.DarkerGray}
                value={userInput}
                onChangeText={(input) => {
                  setUserInput(input?.toUpperCase());
                  setErrorText("");
                }}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
              />
            </View>
            {errorText !== "" && (
              <Text
                style={{
                  color: "red",
                  fontFamily: styles.buttonText.fontFamily,
                  fontSize: 16,
                  textAlign: "center",
                  paddingHorizontal: 16,
                }}
              >
                {errorText}
              </Text>
            )}
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
