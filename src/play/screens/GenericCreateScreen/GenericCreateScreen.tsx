import { BigButton } from "@/src/core/components/BigButton/BigButton";
import { KeyboardAvoidingWrapper } from "@/src/core/components/KeyboardAvoidingWrapper/KeyboardAvoidingWrapper";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { validMaxLength } from "@/src/core/utils/InputValidator";
import { moderateScale } from "@/src/core/utils/dimensions";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Color from "../../../core/constants/Color";
import { GameCategory, GameType } from "../../../core/constants/Types";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import CategoryDropdown from "./components/CategoryDropdown/CategoryDropdown";
import { styles } from "./genericCreateScreenStyles";

interface GenericCreateScreenProps {
  themeColor: string;
  secondaryThemeColor: string;
  onBackPressed: () => void;
  onInfoPressed: () => void;
  bottomButtonText: string;
  handleCreateGame: (name: string, category: GameCategory) => void;
}

export const GenericCreateScreen = ({
  themeColor,
  secondaryThemeColor,
  onBackPressed,
  onInfoPressed,
  bottomButtonText,
  handleCreateGame,
}: GenericCreateScreenProps) => {
  const navigation: any = useNavigation();
  const anchorRef = useRef<View>(null);

  const { displayInfoModal, displayActionModal } = useModalProvider();
  const { isHost, gameType } = useGlobalSessionProvider();

  const [inputValue, setInputValue] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [category, setCategory] = useState<GameCategory | undefined>(undefined);

  const subTextColor = () => {
    switch (gameType) {
      case GameType.Quiz:
        return "#FFC09F";
      case GameType.Roulette:
        return "#FFD8B1";
      case GameType.Duel:
        return "#E0EADF";
      case GameType.Imposter:
        return "#B2D8D8";
      default:
        return Color.LightGray;
    }
  };

  const categoryData = [
    { label: "Jentene", value: GameCategory.Girls },
    { label: "Gutta", value: GameCategory.Boys },
    { label: "Mixed", value: GameCategory.Mixed },
    { label: "Indre krets", value: GameCategory.InnerCircle },
  ];

  const handleBack = () => {
    displayActionModal(
      "Er du sikker på at du ikke vil lagre spillet?",
      () => {
        if (onBackPressed) {
          onBackPressed();
          return;
        }

        navigation.goBack();
      },
      () => {},
    );
  };

  const handleSavePressed = () => {
    if (!category) {
      displayInfoModal("Du må velge en kategori!");
      return;
    }
    if (!validMaxLength(inputValue, 15, (msg) => setInputError(msg))) return;
    handleCreateGame(inputValue, category);
  };

  return (
    <KeyboardAvoidingWrapper backgroundColor={themeColor} anchorRef={anchorRef}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="trophy" style={styles.icon} size={moderateScale(420)} />
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleBack();
            }}
            style={styles.iconWrapper}
          >
            <Feather name="chevron-left" size={moderateScale(45)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onInfoPressed?.();
            }}
            style={styles.iconWrapper}
          >
            <Text style={styles.textIcon}>?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.midSection}>
          <Text style={styles.finishedMainText}>Spillet er ferdig!</Text>
          <Text style={{ ...styles.finishedSubText, color: subTextColor() }}>
            Gi spillet ett navn og kategori slik at du kan spille det igjen
          </Text>
        </View>
        <View style={styles.bottomSection}>
          <TextInput
            style={styles.input}
            placeholder={"Spillnavn..."}
            placeholderTextColor={Color.Gray}
            value={inputValue}
            onChangeText={(input) => {
              const sanitized = input.replace(/\n/g, "");
              setInputValue(sanitized);
              if (inputError) setInputError("");
            }}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="done"
          />
          {inputError ? <Text style={styles.inputError}>{inputError}</Text> : null}
          <CategoryDropdown<GameCategory>
            data={categoryData}
            value={category}
            onChange={setCategory}
            placeholder="Velg categori"
            buttonBackgroundColor={secondaryThemeColor}
            buttonTextColor={Color.White}
            onOpen={() => Keyboard.dismiss()}
          />
          {isHost && (
            <BigButton
              label={bottomButtonText}
              backgroundColor={Color.Black}
              textColor={Color.White}
              onPress={handleSavePressed}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default GenericCreateScreen;
