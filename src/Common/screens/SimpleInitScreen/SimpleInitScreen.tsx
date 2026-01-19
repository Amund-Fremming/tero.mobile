import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./simpleInitScreenStyles";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";
import { useNavigation } from "expo-router";

interface SimpleInitScreenProps {
  topButtonCallback: () => void;
  bottomButtonCallback: () => void;
  topButtonText: string;
  bottomButtonText: string;
  secondaryThemeColor: string;
  featherIcon: string;
  themeColor: string;
  iterations: number | string;
  setInput: (value: string) => void;
  inputPlaceholder: string;
  inputValue: string;
  headerText: string;
  onBackPressed?: () => void;
  onInfoPressed?: () => void;
}

export const SimpleInitScreen = ({
  topButtonCallback,
  bottomButtonCallback,
  topButtonText,
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
        <Text style={styles.header}>{headerText}</Text>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.midSection}>
        <Text style={{ ...styles.iterations, opacity: 0.4 }}>{iterations}</Text>
        <Feather
          name={featherIcon as any}
          size={moderateScale(200)}
          style={{
            opacity: 0.4,
          }}
        />
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
        <TouchableOpacity
          onPress={topButtonCallback}
          style={{ ...styles.categoryButton, backgroundColor: secondaryThemeColor }}
        >
          <Text style={styles.bottomText}>{topButtonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={bottomButtonCallback} style={styles.createButton}>
          <Text style={styles.bottomText}>{bottomButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SimpleInitScreen;
