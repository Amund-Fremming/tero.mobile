import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { Text, View } from "react-native";
import styles from "./createScreenStyles";

export const CreateScreen = () => {
  const { gameType } = useGlobalSessionProvider();
  const { getGameTheme } = useThemeProvider();
  const theme = getGameTheme(gameType);

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <ScreenHeader title="Lagre" onBackPressed={() => {}} />
      <Text style={styles.placeholder}>Create Screen</Text>
    </View>
  );
};

export default CreateScreen;
