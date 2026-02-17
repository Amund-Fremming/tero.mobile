import { View, Text } from "react-native";
import styles from "./startedScreenStyles";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import Color from "@/src/common/constants/Color";

export const StartedScreen = ({ navigation }: any) => {
  const handleInfoPressed = () => {
    console.log("info pressed");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Velg spill"
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
        showBorder={true}
        backgroundColor={Color.LightGray}
      />
      <View style={styles.textBox}>
        <Text style={styles.header}>Du kan legge vekk telefonen, spillet har startet.</Text>
      </View>
    </View>
  );
};

export default StartedScreen;
