import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import VerticalScroll from "@/src/core/components/VerticalScroll/VerticalScroll";
import Screen from "@/src/core/constants/Screen";
import { UserRole } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./profileScreenStyles";

export const ProfileScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId, triggerLogout, accessToken, setPseudoId, userData, setUserData } = useAuthProvider();
  const { userService } = useServiceProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { theme, darkMode } = useThemeProvider();
  const styles = createStyles(theme, darkMode);
  const fallbackAvatar = "https://api.dicebear.com/9.x/pixel-art/png?seed=tero";

  const isLoggedIn = accessToken != null;

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");

  const crown = require("../../../core/assets/images/crown.png");

  useEffect(() => {
    setAvatar(userService().getProfilePicture(userData?.id ?? pseudoId, userData?.username));
  }, [userData]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.goBack();
      return;
    }

    fetchUserData();
  }, [accessToken, isLoggedIn]);

  const fetchUserData = async () => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    const result = await userService().getUser(accessToken);
    if (result.isError()) {
      displayErrorModal("Klarte ikke finne din bruker", async () => {
        setUserData(null);
        setIsAdmin(false);
        setAvatar("");
        await triggerLogout(false);
        resetToHomeScreen(navigation);
      });
      return;
    }

    const role = result.value.role;
    const userData = result.value.user;
    setIsAdmin(role === UserRole.Admin);
    setUserData(userData);
    setAvatar(userService().getProfilePicture(userData.id, userData.username));
    return;
  };

  const handleLogout = async () => {
    const success = await triggerLogout();
    if (success) {
      setUserData(null);
      setIsAdmin(false);
      setAvatar("");
    }

    navigation.goBack();
  };

  if (!isLoggedIn) {
    return <View />;
  }

  const handleResetPassword = async () => {
    if (!userData?.email) {
      displayErrorModal("Mangler e-post. Logg inn på nytt.");
      await triggerLogout();
      return;
    }

    const result = await userService().resetPassword(accessToken, userData.email);
    if (result.isError()) {
      console.error("Failed to reset password: {}", result.error);
      displayErrorModal("Kunne ikke resette passord.");
      return;
    }

    displayInfoModal("Reset-passord lenke sendt til din email", "Lenke sendt");
  };

  return (
    <View style={styles.container}>
      <VerticalScroll>
        <ScreenHeader
          title="Profil"
          onBackPressed={() => navigation.goBack()}
          onInfoPress={handleLogout}
          infoIconOverride="log-out"
          backgroundColor={theme.primary}
        />

        <View style={styles.loggedIn}>
          <View style={styles.imageCard}>
            {isAdmin && <Image source={crown} style={styles.crown} />}
            <Image source={{ uri: avatar || fallbackAvatar }} style={styles.image} />
          </View>
          <Text style={styles.name}>
            {userData?.given_name} {userData?.family_name}
          </Text>
          <Text style={styles.username}>@{userData?.username}</Text>

          <View style={styles.layover}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(Screen.SavedGames);
              }}
              style={styles.bigButton}
            >
              <View style={styles.iconGuard}>
                <Feather name="play" size={30} color={styles.contentColor} />
              </View>
              <Text style={styles.buttonText}>Dine spill</Text>
              <Feather name="chevron-right" size={35} color={styles.contentColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(Screen.TipsUs);
              }}
              style={styles.bigButton}
            >
              <View style={styles.iconGuard}>
                <Feather name="sun" size={30} color={styles.contentColor} />
              </View>
              <Text style={styles.buttonText}>Tips oss</Text>
              <Feather name="chevron-right" size={35} color={styles.contentColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(Screen.EditProfile);
              }}
              style={styles.bigButton}
            >
              <View style={styles.iconGuard}>
                <Feather name="edit" size={30} color={styles.contentColor} />
              </View>
              <Text style={styles.buttonText}>Rediger profil</Text>
              <Feather name="chevron-right" size={35} color={styles.contentColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleResetPassword();
              }}
              style={styles.bigButton}
            >
              <View style={styles.iconGuard}>
                <Feather name="lock" size={30} color={styles.contentColor} />
              </View>
              <Text style={styles.buttonText}>Bytt passord</Text>
              <Feather name="chevron-right" size={35} color={styles.contentColor} />
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate(Screen.Admin);
                }}
                style={styles.bigButton}
              >
                <View style={styles.iconGuard}>
                  <Feather name="shield" size={30} color={styles.contentColor} />
                </View>
                <Text style={styles.buttonText}>Admin</Text>
                <Feather name="chevron-right" size={35} color={styles.contentColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </VerticalScroll>
    </View>
  );
};

export default ProfileScreen;
