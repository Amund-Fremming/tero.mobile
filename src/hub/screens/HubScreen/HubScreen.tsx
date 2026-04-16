import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Screen from "../../../core/constants/Screen";
import createStyles, { getBeerIconColor, getIconColor } from "./hubScreenStyles";

export const HubScreen = () => {
  const navigation: any = useNavigation();

  const { theme, darkMode } = useThemeProvider();
  const { redirectUri, triggerLogin, accessToken } = useAuthProvider();
  const { displayActionModal } = useModalProvider();
  const styles = createStyles(darkMode);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (accessToken) {
      navigation.navigate(Screen.Profile);
      return;
    }

    shouldNavigateAfterLogin.current = true;
    triggerLogin();
  };

  const handleSavedGamesPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!accessToken) {
      displayActionModal(
        "Du må logge inn for å se dine spill",
        () => {
          navigation.navigate(Screen.Hub);
          setTimeout(() => triggerLogin(), 200);
        },
        () => {},
      );
      return;
    }
    navigation.navigate(Screen.SavedGames);
  };

  const handleTipsPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate(Screen.TipsUs);
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.bentoGrid}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bentoRow}>
          <TouchableOpacity style={styles.bentoBoxSavedGames} onPress={handleSavedGamesPressed} activeOpacity={0.8}>
            <Feather name="bookmark" size={44} color={getIconColor(darkMode)} />
            <Text style={styles.bentoBoxLabel}>Saved Games</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bentoBoxTips} onPress={handleTipsPressed} activeOpacity={0.8}>
            <Feather name="star" size={44} color={getIconColor(darkMode)} />
            <Text style={styles.bentoBoxLabel}>Tips oss</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bentoBeerBox} activeOpacity={0.8}>
          <MaterialCommunityIcons name="beer" size={48} color={getBeerIconColor(darkMode)} style={styles.beerIcon} />
          <View style={styles.beerContent}>
            <Text style={styles.beerHeader}>Cheap Beer in Oslo</Text>
            <View style={styles.beerList}>
              <View style={styles.beerRow}>
                <Text style={styles.beerPlace}>Olympen</Text>
                <Text style={styles.beerPrice}>49 kr</Text>
              </View>
              <View style={styles.beerRow}>
                <Text style={styles.beerPlace}>Crow Bar</Text>
                <Text style={styles.beerPrice}>55 kr</Text>
              </View>
              <View style={styles.beerRow}>
                <Text style={styles.beerPlace}>Internasjonalen</Text>
                <Text style={styles.beerPrice}>59 kr</Text>
              </View>
              <View style={styles.beerRow}>
                <Text style={styles.beerPlace}>Tilt</Text>
                <Text style={styles.beerPrice}>62 kr</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HubScreen;
