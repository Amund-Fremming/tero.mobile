import { KeyboardAvoidingWrapper } from "@/src/core/components/KeyboardAvoidingWrapper/KeyboardAvoidingWrapper";
import { moderateScale } from "@/src/core/utils/dimensions";
import { Feather, FontAwesome6, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import { styles } from "./genericActiveLobbyScreenStyles";

const STATIC_STYLES = {
  iconOpacity: { opacity: 0.4 },
};

interface GenericActiveLobbyScreenProps {
  themeColor: string;
  secondaryThemeColor: string;
  featherIcon: string;
  iterations: number | string;
  inputPlaceholder: string;
  bottomButtonText: string;
  onStartPressed: () => void;
  onAddRoundPressed: (round: string) => void;
  onBackPressed: () => void;
  onInfoPressed?: () => void;
}

export const GenericActiveLobbyScreen = ({
  themeColor,
  secondaryThemeColor,
  featherIcon,
  iterations,
  inputPlaceholder,
  bottomButtonText,
  onStartPressed,
  onAddRoundPressed,
  onBackPressed,
  onInfoPressed,
}: GenericActiveLobbyScreenProps) => {
  const anchorRef = useRef<View>(null);

  const { sessionData: sessionData, isHost } = useGlobalSessionProvider();

  const [inputValue, setInputValue] = useState<string>("");

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

  const handleAddRound = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setInputValue("");
    onAddRoundPressed(inputValue);
  };

  return (
    <KeyboardAvoidingWrapper backgroundColor={themeColor} anchorRef={anchorRef}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onBackPressed();
            }}
            style={styles.iconWrapper}
          >
            <Feather name="chevron-left" size={moderateScale(45)} />
          </TouchableOpacity>
          <View style={styles.headerInline}>
            <Text style={styles.toastHeader}>Rom:</Text>
            <Text style={styles.headerSecondScreen}>{sessionData.gameKey?.toUpperCase()}</Text>
          </View>
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
          <Text style={styles.iterations}>{iterations === "?" ? "" : iterations}</Text>
          {getIcon()}
        </View>
        <View style={styles.bottomSection}>
          <TextInput
            style={styles.input}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChangeText={(input) => setInputValue(input)}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="done"
          />
          <View style={styles.inputBorder} />
          <TouchableOpacity
            ref={anchorRef}
            onPress={handleAddRound}
            style={{ ...styles.categoryButton, backgroundColor: secondaryThemeColor }}
          >
            <Text style={styles.bottomText}>Legg til</Text>
          </TouchableOpacity>
          {isHost && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                void onStartPressed();
              }}
              style={styles.createButton}
            >
              <Text style={styles.bottomText}>{bottomButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default GenericActiveLobbyScreen;
