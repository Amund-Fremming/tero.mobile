import HubConnectionProvider from "@/src/play/context/HubConnectionProvider";
import GlobalGameProvider from "../src/play/context/GlobalSessionProvider";
import ModalProvider from "@/src/core/context/ModalProvider";
import Hub from "@/src/hub/Hub";
import AuthProvider from "../src/core/context/AuthProvider";
import ServiceProvider from "@/src/core/context/ServiceProvider";
import { View, StatusBar, Dimensions } from "react-native";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import SplashScreen from "@/src/core/components/SplashScreen/SplashScreen";
import QuizSessionProvider from "@/src/play/games/quizGame/context/QuizGameProvider";
import ImposterSessionProvider from "@/src/play/games/imposter/context/ImposterSessionProvider";
import SpinSessionProvider from "@/src/play/games/spinGame/context/SpinGameProvider";
import * as ExpoSplashScreen from "expo-splash-screen";

ExpoSplashScreen.hide();

const IMAGES = [
  require("../src/core/assets/images/quiz.webp"),
  require("../src/core/assets/images/roulette.webp"),
  require("../src/core/assets/images/duel.webp"),
  require("../src/core/assets/images/imposter.webp"),
  require("../src/core/assets/images/dice.webp"),
  require("../src/core/assets/images/finger.jpg"),
];

const { width, height } = Dimensions.get("window");

export default () => (
  <FontLoader>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    <ServiceProvider>
      <ModalProvider>
        <AuthProvider>
          <GlobalGameProvider>
            <HubConnectionProvider>
              <QuizSessionProvider>
                <SpinSessionProvider>
                  <ImposterSessionProvider>
                    <Hub />
                  </ImposterSessionProvider>
                </SpinSessionProvider>
              </QuizSessionProvider>
            </HubConnectionProvider>
          </GlobalGameProvider>
        </AuthProvider>
      </ModalProvider>
    </ServiceProvider>
  </FontLoader>
);

const FontLoader = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = Font.useFonts({
    "PassionOne-Regular": require("../src/core/assets/fonts/PassionOne-Regular.ttf"),
    "PassionOne-Bold": require("../src/core/assets/fonts/PassionOne-Bold.ttf"),
    "SpaceMono-Regular": require("../src/core/assets/fonts/SpaceMono-Regular.ttf"),
    "Sintony-Regular": require("../src/core/assets/fonts/Sintony-Regular.ttf"),
    "Sintony-Bold": require("../src/core/assets/fonts/Sintony-Bold.ttf"),
    "ArchivoBlack-Regular": require("../src/core/assets/fonts/ArchivoBlack-Regular.ttf"),
  });
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      Asset.loadAsync(IMAGES);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ width, height, position: "absolute", top: 0, left: 0 }}>
      {children}
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
    </View>
  );
};
