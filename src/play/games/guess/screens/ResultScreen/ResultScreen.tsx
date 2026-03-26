import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { Text, View } from "react-native";
import styles from "./resultScreenStyles";

type Props = { onLeave: () => void };

export const ResultScreen = ({ onLeave }: Props) => {
  const { gameType } = useGlobalSessionProvider();
  const theme = getGameTheme(gameType);

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader title="" onBackPressed={onLeave} />
      <Text style={styles.placeholder}>Result Screen</Text>
    </View>
  );
};

export default ResultScreen;
