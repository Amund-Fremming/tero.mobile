import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { Text, View } from "react-native";
import { styles } from "./defuserGameStyles";

export default function DefuserGame() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Defuser" />
      <View style={styles.content}>
        <Text style={{ color: Color.Black, fontSize: 32, textAlign: "center", marginTop: 40 }}>Defuser</Text>
      </View>
    </View>
  );
}
