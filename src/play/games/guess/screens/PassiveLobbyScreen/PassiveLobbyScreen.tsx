import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { Text, View } from "react-native";
import styles from "./passiveLobbyScreenStyles";

type Props = { onLeave: () => void };

export const PassiveLobbyScreen = ({ onLeave }: Props) => {
  const { gameType } = useGlobalSessionProvider();
  const theme = getGameTheme(gameType);

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader title="" onBackPressed={onLeave} />
      <Text style={styles.placeholder}>Passive Lobby</Text>
    </View>
  );
};

export default PassiveLobbyScreen;
