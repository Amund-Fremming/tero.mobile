import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { Text, View } from "react-native";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import styles from "./startedScreenStyles";

type Props = {
  onLeave: () => void;
};

export const StartedScreen = ({ onLeave }: Props) => {
  const { clearImposterSessionValues } = useImposterSessionProvider();

  return (
    <View style={styles.container}>
      <ScreenHeader title="" onBackPressed={onLeave} />
      <View style={styles.textBox}>
        <Text style={styles.header}>Spillet har startet!</Text>
        <Text style={styles.subHeader}>
          Ønsker du å styre spillet selv, kan du starte det ved å finne det under velg spill
        </Text>
      </View>
    </View>
  );
};

export default StartedScreen;
