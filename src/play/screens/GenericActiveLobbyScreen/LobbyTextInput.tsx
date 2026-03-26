import { moderateScale } from "@/src/core/utils/dimensions";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Keyboard, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { styles } from "./genericActiveLobbyScreenStyles";

const MAX_LENGTH = 50;

interface LobbyTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonColor: string;
}

export const LobbyTextInput = ({ value, onChangeText, onSubmit, placeholder, buttonColor }: LobbyTextInputProps) => {
  const [error, setError] = useState<string>("");

  const handleChangeText = (input: string) => {
    const sanitized = input.replace(/\n/g, "");
    onChangeText(sanitized);
    if (error) setError("");
  };

  const handleSubmit = () => {
    if (value.length > MAX_LENGTH) {
      setError(`Maks ${MAX_LENGTH} tegn per runde.`);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError("");
    onSubmit();
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={Keyboard.dismiss}
        returnKeyType="done"
        multiline
      />
      {error ? <Text style={styles.inputError}>{error}</Text> : null}
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ ...styles.categoryButton, backgroundColor: buttonColor }}
      >
        <Text style={styles.bottomText}>Legg til</Text>
      </TouchableOpacity>
    </>
  );
};

export default LobbyTextInput;
