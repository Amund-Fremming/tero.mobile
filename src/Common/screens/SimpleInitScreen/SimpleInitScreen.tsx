import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { styles } from "./simpleInitScreenStyles";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useMemo, useState } from "react";
import CategoryDropdown from "../../components/CategoryDropdown/CategoryDropdown";
import { GameCategory } from "../../constants/Types";
import Color from "../../constants/Color";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";

const STATIC_STYLES = {
  iterationsOpacity: { opacity: 0.4 },
  iconOpacity: { opacity: 0.4 },
};

interface SimpleInitScreenProps {
  isFirstPage: boolean;
  themeColor: string;
  secondaryThemeColor: string;
  onBackPressed?: () => void;
  onInfoPressed?: () => void;
  headerText: string;
  topButtonText: string;
  topButtonOnChange: (value: any) => void;
  topButtonOnPress: () => void;
  bottomButtonText: string;
  bottomButtonCallback: () => void;
  featherIcon: string;
  iterations: number | string;
  inputPlaceholder: string;
  inputValue: string;
  setInput: (input: string) => void;
}

export const SimpleInitScreen = ({
  isFirstPage,
  topButtonOnChange,
  topButtonOnPress,
  bottomButtonCallback,
  topButtonText: categoryButtonText,
  bottomButtonText,
  secondaryThemeColor,
  featherIcon,
  themeColor,
  iterations,
  setInput,
  inputPlaceholder,
  inputValue,
  headerText,
  onBackPressed,
  onInfoPressed,
}: SimpleInitScreenProps) => {
  const navigation: any = useNavigation();
  const { gameKey } = useGlobalSessionProvider();

  const categoryData = [
    { label: "Alle", value: GameCategory.All },
    { label: "Vors", value: GameCategory.Vors },
    { label: "Jenter", value: GameCategory.Ladies },
    { label: "Gutter", value: GameCategory.Boys },
  ];

  const handleBackPressed = () => {
    if (onBackPressed) {
      onBackPressed();
    } else {
      navigation.goBack();
    }
  };

  const handleInfoPressed = () => {
    if (onInfoPressed) {
      onInfoPressed();
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        {isFirstPage && <Text style={styles.header}>{headerText}</Text>}
        {!isFirstPage && (
          <View style={styles.headerInline}>
            <Text style={styles.toastHeader}>Rom:</Text>
            <Text style={styles.headerSecondScreen}>{gameKey?.toUpperCase()}</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.midSection}>
        <Text style={styles.iterations}>{iterations}</Text>
        <Feather name={featherIcon as any} size={moderateScale(200)} style={STATIC_STYLES.iconOpacity} />
      </View>
      <View style={styles.bottomSection}>
        <TextInput
          multiline
          style={styles.input}
          placeholder={inputPlaceholder}
          value={inputValue}
          onChangeText={setInput}
        />
        <View style={styles.inputBorder} />
        {isFirstPage && (
          <CategoryDropdown
            data={categoryData}
            value={categoryButtonText}
            onChange={(value) => topButtonOnChange(value)}
            placeholder="Velg categori"
            buttonBackgroundColor={secondaryThemeColor}
            buttonTextColor={Color.White}
          />
        )}
        {!isFirstPage && (
          <TouchableOpacity
            onPress={topButtonOnPress}
            style={{ ...styles.categoryButton, backgroundColor: secondaryThemeColor }}
          >
            <Text style={styles.bottomText}>Legg til</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={bottomButtonCallback} style={styles.createButton}>
          <Text style={styles.bottomText}>{bottomButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SimpleInitScreen;
