import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useSpinSessionProvider } from "@/src/play/games/spinGame/context/SpinGameProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./finishedScreenStyles";

type Props = {
  onLeave: () => void;
};

const FinishedScreen = ({ onLeave }: Props) => {
  const { themeColor } = useSpinSessionProvider();

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <ScreenHeader title="" onBackPressed={onLeave} />
      <MaterialCommunityIcons
        name="trophy"
        size={moderateScale(420)}
        style={{
          position: "absolute",
          opacity: 0.15,
          left: "50%",
          top: "45%",
          transform: [{ translateX: -moderateScale(210) }, { translateY: -moderateScale(210) }],
        }}
      />
      <Text style={styles.text}>Spillet er ferdig!</Text>
      <TouchableOpacity style={styles.button} onPress={onLeave}>
        <Text style={styles.buttonText}>Hjem</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinishedScreen;
