import { View } from "react-native";
import { styles } from "./diceGameStyles";
import { useNavigation } from "expo-router";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";

export const DiceGame = () => {
  const navigation: any = useNavigation();

  const handleInfoPressed = () => {
    //
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Terning"
        backgroundColor={Color.LightGray}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
      />
    </View>
  );
};

export default DiceGame;
