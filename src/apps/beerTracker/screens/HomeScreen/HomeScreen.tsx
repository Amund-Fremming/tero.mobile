import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { Text, View } from "react-native";

export const HomeScreen = () => {
  const navigation: any = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Beer Tracker" onBackPressed={() => navigation.goBack()} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>HomeScreen</Text>
      </View>
    </View>
  );
};

export default HomeScreen;
