import SplashScreen from "@/src/core/components/SplashScreen/SplashScreen";
import ModalProvider from "@/src/core/context/ModalProvider";
import ServiceProvider from "@/src/core/context/ServiceProvider";
import ToastProvider from "@/src/core/context/ToastProvider";
import { setupNotifications } from "@/src/core/services/notificationService";
import Hub from "@/src/hub/Hub";
import HubConnectionProvider from "@/src/play/context/HubConnectionProvider";
import ImposterSessionProvider from "@/src/play/games/imposter/context/ImposterSessionProvider";
import QuizSessionProvider from "@/src/play/games/quizGame/context/QuizGameProvider";
import SpinSessionProvider from "@/src/play/games/spinGame/context/SpinGameProvider";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Dimensions, StatusBar, View } from "react-native";
import AuthProvider from "../src/core/context/AuthProvider";
import SavedGamesProvider from "../src/core/context/SavedGamesProvider";
import GlobalGameProvider from "../src/play/context/GlobalSessionProvider";

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
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <SavedGamesProvider>
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
            </SavedGamesProvider>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
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
      setupNotifications();
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
