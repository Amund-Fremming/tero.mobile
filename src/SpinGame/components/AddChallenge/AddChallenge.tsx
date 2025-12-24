import { View, TextInput, Text, Pressable } from "react-native";
import CheckBox from "../CheckBox/CheckBox";
import styles from "./addChallengeStyles";
import { useState } from "react";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";

export const AddChallenge = () => {
  const [readBeforeSpin, setReadBeforeSpin] = useState<boolean>(true);
  const [challenge, setChallenge] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);

  const { displayErrorModal } = useModalProvider();
  const { invokeFunction } = useHubConnectionProvider();
  const { universalGameValues } = useGlobalSessionProvider();

  const handleAddChallenge = async () => {
    if (!universalGameValues) {
      displayErrorModal("Noe gikk galt, prøv å gå inn og ut av spillet.");
      return;
    }

    const result = await invokeFunction(
      "AddChallenge",
      universalGameValues.gameId,
      participants,
      challenge,
      readBeforeSpin
    );
    if (result.isError()) {
      displayErrorModal(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput onChangeText={(input) => setChallenge(input)} placeholder="Challenge ..." />
      <Text>Participants:</Text>
      <View style={styles.participantsWrapper}>
        <Pressable onPress={() => setParticipants(participants - 1 == 0 ? 1 : participants - 1)}>
          <Text style={styles.participantsButton}>-</Text>
        </Pressable>
        <Text>{participants}</Text>
        <Pressable onPress={() => setParticipants(participants + 1 == 4 ? 3 : participants + 1)}>
          <Text style={styles.participantsButton}>+</Text>
        </Pressable>
      </View>
      <View style={styles.selectedWrapper}>
        <Text>Les challenge før spin?</Text>
        <CheckBox checked={readBeforeSpin} onCheck={setReadBeforeSpin} />
      </View>
      <Pressable onPress={handleAddChallenge}>
        <Text>Legg til</Text>
      </Pressable>
    </View>
  );
};

export default AddChallenge;
