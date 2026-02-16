import { View, Text, TouchableOpacity } from "react-native";
import styles from "./startedScreenStyles";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/common/utils/dimensions";

export const StartedScreen = ({ navigation }: any) => {

  const handleInfoPressed = () => {
    console.log("info pressed");
  }

  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
            <Feather name="chevron-left" size={moderateScale(45)} />
          </TouchableOpacity>
          <Text style={styles.header}>Velg spill</Text>
          <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
            <Text style={styles.textIcon}>?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.header}>Du kan legge vekk telefonen, spillet har startet.</Text>
      </View>
    </View>
  );
};

export default StartedScreen;
