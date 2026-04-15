import { useState } from "react";
import { Keyboard, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BigButton } from "../../../core/components/BigButton/BigButton";
import Color from "../../../core/constants/Color";
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
    setError("");
    onSubmit();
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Color.Gray}
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={Keyboard.dismiss}
        returnKeyType="done"
        multiline
        blurOnSubmit={true}
      />
      {error ? <Text style={styles.inputError}>{error}</Text> : null}
      <BigButton label="Legg til" backgroundColor={buttonColor} textColor={Color.White} onPress={handleSubmit} />
    </>
  );
};

export default LobbyTextInput;
