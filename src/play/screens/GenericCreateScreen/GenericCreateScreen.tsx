import { KeyboardAvoidingWrapper } from "@/src/core/components/KeyboardAvoidingWrapper/KeyboardAvoidingWrapper";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { Feather, FontAwesome6, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Color from "../../../core/constants/Color";
import { GameCategory } from "../../../core/constants/Types";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import CategoryDropdown from "./components/CategoryDropdown/CategoryDropdown";
import { styles } from "./genericCreateScreenStyles";

const STATIC_STYLES = {
  iconOpacity: { opacity: 0.4 },
};

interface GenericCreateScreenProps {
  themeColor: string;
  secondaryThemeColor: string;
  onBackPressed: () => void;
  onInfoPressed: () => void;
  headerText: string;
  bottomButtonText: string;
  handleCreateGame: (name: string, category: GameCategory) => void;
  featherIcon: string;
}

export const GenericCreateScreen = ({
  themeColor,
  secondaryThemeColor,
  onBackPressed,
  onInfoPressed,
  headerText,
  bottomButtonText,
  handleCreateGame,
  featherIcon,
}: GenericCreateScreenProps) => {
  const navigation: any = useNavigation();
  const anchorRef = useRef<View>(null);

  const { isHost } = useGlobalSessionProvider();
  const { displayInfoModal, displayActionModal } = useModalProvider();

  const [inputValue, setInputValue] = useState<string>("");
  const [category, setCategory] = useState<GameCategory | undefined>(undefined);

  const categoryData = [
    { label: "Jentene", value: GameCategory.Girls },
    { label: "Gutta", value: GameCategory.Boys },
    { label: "Mixed", value: GameCategory.Mixed },
    { label: "Indre krets", value: GameCategory.InnerCircle },
  ];

  const getIcon = () => {
    if (featherIcon === "sword-cross") {
      return (
        <MaterialCommunityIcons
          name={featherIcon as any}
          size={moderateScale(200)}
          color="black"
          style={STATIC_STYLES.iconOpacity}
        />
      );
    }

    if (featherIcon === "stack") {
      return (
        <Octicons name={featherIcon as any} size={moderateScale(200)} color="black" style={STATIC_STYLES.iconOpacity} />
      );
    }

    if (featherIcon === "arrows-spin") {
      return (
        <FontAwesome6
          name={featherIcon as any}
          size={moderateScale(200)}
          color="black"
          style={STATIC_STYLES.iconOpacity}
        />
      );
    }

    return (
      <Feather name={featherIcon as any} size={moderateScale(200)} color="black" style={STATIC_STYLES.iconOpacity} />
    );
  };

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleCreateGame(inputValue, category);
  };

  return (
    <KeyboardAvoidingWrapper backgroundColor={themeColor} anchorRef={anchorRef}>
      <View style={styles.container}>
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
          <Text style={styles.header}>{headerText}</Text>
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
          <View style={{ paddingTop: verticalScale(100) }} />
          {getIcon()}
        </View>
        <View style={styles.bottomSection}>
          <TextInput
            style={styles.input}
            placeholder={"Spillnavn..."}
            value={inputValue}
            onChangeText={(input) => setInputValue(input)}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="done"
          />
          <View style={styles.inputBorder} />
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
            <TouchableOpacity onPress={handleSavePressed} style={styles.createButton}>
              <Text style={styles.bottomText}>{bottomButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default GenericCreateScreen;
