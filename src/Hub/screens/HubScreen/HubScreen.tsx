import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Screen from "../../../core/constants/Screen";
import styles from "./hubScreenStyles";

export const HubScreen = () => {
  const navigation: any = useNavigation();

  const { redirectUri, triggerLogin, accessToken } = useAuthProvider();

  const shouldNavigateAfterLogin = useRef(false);

  // Navigate to profile only when a login flow was initiated from this screen
  useEffect(() => {
    if (accessToken && shouldNavigateAfterLogin.current) {
      shouldNavigateAfterLogin.current = false;
      navigation.navigate(Screen.Profile);
    }

    console.debug("Redirect URI:", redirectUri);
  }, [accessToken, navigation]);

  const handleProfilePressed = () => {
    if (accessToken) {
      navigation.navigate(Screen.Profile);
      return;
    }

    shouldNavigateAfterLogin.current = true;
    triggerLogin();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Hub"
        onBackPressed={() => navigation.goBack()}
        infoIconOverride="user"
        onInfoPress={handleProfilePressed}
        backgroundColor={Color.BuzzifyLavender}
      />
    </View>
  );
};

export default HubScreen;
// a319f637-58d0-45e7-bc89-8c2b3a668a42
// a319f637-58d0-45e7-bc89-8c2b3a668a42
