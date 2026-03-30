import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { Text, View } from "react-native";
import styles from "./guessScreenStyles";

type Props = { onLeave: () => void };

export const GuessScreen = ({ onLeave }: Props) => {
  const { gameType } = useGlobalSessionProvider();
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(gameType);

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader title="" onBackPressed={onLeave} />
      <Text style={styles.placeholder}>Guess Screen</Text>
    </View>
  );
};

export default GuessScreen;
