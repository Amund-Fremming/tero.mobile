import { Pressable, View } from "react-native";
import styles from "./gameScreenStyles";
import { useEffect, useState, useRef } from "react";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useHubConnectionProvider } from "@/src/common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";
import { resetToHomeScreen } from "@/src/common/utils/navigation";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import Color from "@/src/common/constants/Color";

export const GameScreen = () => {
  const navigation: any = useNavigation();

  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues } = useImposterSessionProvider();

  useEffect(() => {
    return () => {
      clearImposterSessionValues();
      clearGlobalSessionValues();
    };
  }, []);

  const handleLeaveGame = () => {
    clearGlobalSessionValues();
    clearImposterSessionValues();
    resetToHomeScreen(navigation);
  };

  const handleInfoPressed = () => {
    //
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Imposter" onBackPressed={handleLeaveGame} onInfoPress={handleInfoPressed} />
    </View>
  );
};

export default GameScreen;
