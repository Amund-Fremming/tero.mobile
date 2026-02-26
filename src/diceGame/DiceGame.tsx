import { View } from "react-native";
import { styles } from "./diceGameStyles";
import ScreenHeader from "../Common/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import Color from "../Common/constants/Color";

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
