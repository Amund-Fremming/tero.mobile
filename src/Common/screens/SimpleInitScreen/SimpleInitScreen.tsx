import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { styles } from "./simpleInitScreenStyles";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/common/utils/dimensions";
import CategoryDropdown from "../../components/CategoryDropdown/CategoryDropdown";
import { GameCategory } from "../../constants/Types";
import Color from "../../constants/Color";
import { useGlobalSessionProvider } from "../../context/GlobalSessionProvider";
import { useNavigation } from "expo-router";

const STATIC_STYLES = {
  iterationsOpacity: { opacity: 0.4 },
  iconOpacity: { opacity: 0.4 },
};

interface SimpleInitScreenProps {
  createScreen: boolean;
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
  createScreen,
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
  const { gameKey, isHost } = useGlobalSessionProvider();

  const categoryData = [
    { label: "Jentene", value: GameCategory.Girls },
    { label: "Gutta", value: GameCategory.Boys },
    { label: "Mixed", value: GameCategory.Mixed },
    { label: "Indre krets", value: GameCategory.InnerCircle },
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
        {createScreen && <Text style={styles.header}>{headerText}</Text>}
        {!createScreen && (
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
        {createScreen && (
          <CategoryDropdown
            data={categoryData}
            value={categoryButtonText}
            onChange={(value) => topButtonOnChange(value)}
            placeholder="Velg categori"
            buttonBackgroundColor={secondaryThemeColor}
            buttonTextColor={Color.White}
          />
        )}
        {!createScreen && (
          <TouchableOpacity
            onPress={topButtonOnPress}
            style={{ ...styles.categoryButton, backgroundColor: secondaryThemeColor }}
          >
            <Text style={styles.bottomText}>Legg til</Text>
          </TouchableOpacity>
        )}
        {isHost && (
          <TouchableOpacity onPress={bottomButtonCallback} style={styles.createButton}>
            <Text style={styles.bottomText}>{bottomButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SimpleInitScreen;
