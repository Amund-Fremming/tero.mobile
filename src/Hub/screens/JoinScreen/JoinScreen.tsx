import { View, Text, TouchableOpacity } from "react-native";

import styles from "./joinScreenStyles";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useGlobalGameProvider } from "../../../Common/context/GlobalGameProvider";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/Common/constants/Color";
import BigButton from "@/src/Common/components/BigButton/BigButton";
import { GameEntryMode } from "@/src/Common/constants/Types";

export const JoinScreen = ({ navigation }: any) => {
  const [userInput, setUserInput] = useState<string>("");

  const { pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const { setGameEntryMode } = useGlobalGameProvider();

  useEffect(() => {
    setGameEntryMode(GameEntryMode.Participant);
  }, []);

  const handleJoinGame = () => {
    //
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.goBack} onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={36} color={Color.OffBlack} />
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.header}>Skriv in kodeordet</Text>
        <View style={styles.inputWrapper}>
          <Feather name="key" size={30} color={Color.OffBlack} />
          <TextInput
            style={styles.input}
            placeholder="SLEM POTET"
            value={userInput}
            onChangeText={(input) => setUserInput(input.toLowerCase())}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
          <Text style={styles.buttonText}>Bli med</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinScreen;
