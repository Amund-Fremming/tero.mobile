import HubConnectionProvider from "@/src/Common/context/HubConnectionProvider";
import GlobalGameProvider from "../src/Common/context/GlobalSessionProvider";
import ModalProvider from "@/src/Common/context/ModalProvider";
import Hub from "@/src/Hub/Hub";
import AuthProvider from "../src/Common/context/AuthProvider";
import ServiceProvider from "@/src/Common/context/ServiceProvider";
import { View, StatusBar, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});
import QuizSessionProvider from "@/src/quizGame/context/QuizGameProvider";
import SpinSessionProvider from "@/src/SpinGame/context/SpinGameProvider";
import ImposterSessionProvider from "@/src/imposter/context/ImposterSessionProvider";
import "@/src/Common/utils/logConfig"; // Configure logging

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
    "PassionOne-Regular": require("../src/Common/assets/fonts/PassionOne-Regular.ttf"),
    "PassionOne-Bold": require("../src/Common/assets/fonts/PassionOne-Bold.ttf"),
    "SpaceMono-Regular": require("../src/Common/assets/fonts/SpaceMono-Regular.ttf"),
    "Sintony-Regular": require("../src/Common/assets/fonts/Sintony-Regular.ttf"),
    "Sintony-Bold": require("../src/Common/assets/fonts/Sintony-Bold.ttf"),
    "ArchivoBlack-Regular": require("../src/Common/assets/fonts/ArchivoBlack-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <View style={{ width, height, position: "absolute", top: 0, left: 0 }}>{children}</View>;
};
