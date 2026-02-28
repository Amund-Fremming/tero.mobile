import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./problemScreenStyles";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/core/constants/Color";
import { useEffect, useState } from "react";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import * as Haptics from "expo-haptics";

const MAX_RETRIES = 6;
const BASE_DELAY = 1000;

interface Props {
  onHealthRestored?: () => void;
}

export const ProblemScreen = ({ onHealthRestored }: Props) => {
  const { commonService } = useServiceProvider();
  const [showRetryButton, setShowRetryButton] = useState(false);

  useEffect(() => {
    runBackoff();
  }, []);

  const isHealthOk = async (): Promise<boolean> => {
    const result = await commonService().healthDetailed();
    return !result.isError() && result.value.platform && result.value.database;
  };

  const runBackoff = async () => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const ok = await isHealthOk();
      if (ok) {
        onHealthRestored?.();
        return;
      }
      const delay = BASE_DELAY * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    setShowRetryButton(true);
  };

  const handleManualCheck = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ok = await isHealthOk();
    if (ok) {
      onHealthRestored?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.iconContainer}>
          <Feather name="alert-circle" size={120} color={Color.HomeRed} />
        </View>

        <Text style={styles.mainHeader}>Oisann!</Text>

        <Text style={styles.subHeader}>En feil har skjedd</Text>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>Vennligst forsøk å lukke appen, og start den på nytt.</Text>
          <Text style={styles.message}>Vi jobber med problemet!</Text>
        </View>

        <View style={styles.decorativeContainer}>
          <Feather name="tool" size={40} color={Color.Gray} style={styles.decorativeIcon} />
          <Feather name="settings" size={40} color={Color.Gray} style={styles.decorativeIcon} />
          <Feather name="cpu" size={40} color={Color.Gray} style={styles.decorativeIcon} />
        </View>

        {showRetryButton && (
          <TouchableOpacity style={styles.button} onPress={handleManualCheck}>
            <Text style={styles.buttonText}>Sjekk på nytt</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
