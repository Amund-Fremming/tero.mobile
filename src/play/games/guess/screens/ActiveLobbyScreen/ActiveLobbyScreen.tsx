import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { Text, View } from "react-native";
import styles from "./activeLobbyScreenStyles";

export const ActiveLobbyScreen = () => {
  const { gameType } = useGlobalSessionProvider();
  const theme = getGameTheme(gameType);

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader title="Lobby" onBackPressed={() => {}} />
      <Text style={styles.placeholder}>Active Lobby</Text>
    </View>
  );
};

export default ActiveLobbyScreen;
