import { View, Text } from "react-native";
import { styles } from "./problemScreenStyles";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/core/constants/Color";

export const ProblemScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.iconContainer}>
          <Feather name="alert-circle" size={120} color={Color.BuzzifyLavender} />
        </View>

        <Text style={styles.mainHeader}>Oisann!</Text>

        <Text style={styles.subHeader}>En feil har skjedd</Text>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>Vennligst forsøk å lukke appen, og start den på nytt.</Text>
          <Text style={styles.message}>Vi jobber med problemet!</Text>
        </View>

        <View style={styles.decorativeContainer}>
          <Feather name="tool" size={40} color={Color.Gray} style={styles.decorativeIcon} />
          <Feather name="settings" size={40} color={Color.Gray} style={styles.decorativeIcon} />
          <Feather name="cpu" size={40} color={Color.Gray} style={styles.decorativeIcon} />
        </View>
      </View>
    </View>
  );
};
