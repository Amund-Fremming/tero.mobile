import { useCallback } from "react";
import HubConnectionProvider from "@/src/Common/context/HubConnectionProvider";
import GlobalGameProvider from "../src/Common/context/GlobalSessionProvider";
import ModalProvider from "@/src/Common/context/ModalProvider";
import Hub from "@/src/Hub/Hub";
import AuthProvider from "../src/Common/context/AuthProvider";
import ServiceProvider from "@/src/Common/context/ServiceProvider";
import { View, StatusBar, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import QuizSessionProvider from "@/src/quizGame/context/QuizGameProvider";
import SpinGameProvider from "@/src/SpinGame/context/SpinGameProvider";

SplashScreen.preventAutoHideAsync();

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
                <SpinGameProvider>
                  <Hub />
                </SpinGameProvider>
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
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ width, height, position: "absolute", top: 0, left: 0 }} onLayout={onLayoutRootView}>
      {children}
    </View>
  );
};
