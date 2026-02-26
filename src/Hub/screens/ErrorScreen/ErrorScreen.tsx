import { View, Text } from "react-native";
import { styles } from "./errorScreenStyles";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/core/constants/Color";

export const ErrorScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.iconContainer}>
          <Feather name="alert-circle" size={120} color={Color.HomeRed} />
        </View>

        <Text style={styles.mainHeader}>Oops!</Text>

        <Text style={styles.subHeader}>Appen er ikke tilgjengelig</Text>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>Vi opplever tekniske problemer for øyeblikket.</Text>
          <Text style={styles.message}>Vennligst prøv igjen senere.</Text>
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
