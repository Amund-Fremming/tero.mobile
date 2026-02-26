import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./profileScreenStyles";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useEffect, useState } from "react";
import { UserRole } from "@/src/core/constants/Types";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/core/constants/Color";
import Screen from "@/src/core/constants/Screen";
import { horizontalScale } from "@/src/core/utils/dimensions";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import VerticalScroll from "@/src/core/components/VerticalScroll/VerticalScroll";
import { useModalProvider } from "@/src/core/context/ModalProvider";

export const ProfileScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId, triggerLogout, accessToken, setPseudoId, userData, setUserData } = useAuthProvider();
  const { userService } = useServiceProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();

  const isLoggedIn = accessToken != null;

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");

  const crown = require("../../../core/assets/images/crown.png");

  useEffect(() => {
    setAvatar(userService().getProfilePicture(pseudoId, userData?.username));
  }, [userData]);

  useEffect(() => {
    fetchUserData();
  }, [accessToken]);

  const fetchUserData = async () => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    const result = await userService().getUser(accessToken);
    if (result.isError()) {
      return;
    }

    const role = result.value.role;
    const userData = result.value.user;
    setPseudoId(userData.id);
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
    navigation.goBack();
    return <View />;
  }

  const handleResetPassword = async () => {
    if (!userData?.email) {
      displayErrorModal("Mangler e-post. Logg inn på nytt.");
      await triggerLogout();
      return;
    }

    const result = await userService().resetPassword(accessToken, pseudoId, userData.email);
    if (result.isError()) {
      console.error("Failed to reset password: {}", result.error);
      displayErrorModal("Kunne ikke resette passord.");
      return;
    }

    displayInfoModal("Reset-lenke sendt.", "E-post");
  };

  return (
    <View style={styles.container}>
      <VerticalScroll>
        <ScreenHeader
          title="Profil"
          onBackPressed={() => navigation.goBack()}
          onInfoPress={handleLogout}
          infoIconOverride="log-out"
        />

        <View style={styles.loggedIn}>
          <View style={styles.imageCard}>
            {isAdmin && <Image source={crown} style={styles.crown} />}
            <Image source={{ uri: avatar }} style={styles.image} />
          </View>
          <Text style={styles.name}>
            {userData?.given_name} {userData?.family_name}
          </Text>
          <Text style={styles.username}>@{userData?.username}</Text>

          <View style={styles.layover}>
            <Pressable onPress={() => navigation.navigate(Screen.EditProfile)} style={styles.bigButton}>
              <View style={styles.iconGuard}>
                <Feather name="edit" size={30} color={Color.Black} />
              </View>
              <Text style={styles.buttonText}>Rediger profil</Text>
              <Feather name="chevron-right" size={35} color={Color.Black} />
            </Pressable>
            <Pressable onPress={handleResetPassword} style={styles.bigButton}>
              <View style={styles.iconGuard}>
                <Feather name="lock" size={30} color={Color.Black} />
              </View>
              <Text style={styles.buttonText}>Bytt passord</Text>
              <Feather name="chevron-right" size={35} color={Color.Black} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate(Screen.TipsUs)} style={styles.bigButton}>
              <View style={styles.iconGuard}>
                <Feather name="sun" size={30} color={Color.Black} />
              </View>
              <Text style={styles.buttonText}>Tips oss</Text>
              <Feather name="chevron-right" size={35} color={Color.Black} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate(Screen.SavedGames)} style={styles.bigButton}>
              <View style={styles.iconGuard}>
                <Feather name="play" size={30} color={Color.Black} />
              </View>
              <Text style={styles.buttonText}>Dine spill</Text>
              <Feather name="chevron-right" size={35} color={Color.Black} />
            </Pressable>
            {isAdmin && (
              <Pressable onPress={() => navigation.navigate(Screen.Admin)} style={styles.bigButton}>
                <View style={styles.iconGuard}>
                  <Feather name="shield" size={30} color={Color.Black} />
                </View>
                <Text style={styles.buttonText}>Admin</Text>
                <Feather name="chevron-right" size={35} color={Color.Black} />
              </Pressable>
            )}
          </View>
        </View>
      </VerticalScroll>
    </View>
  );
};

export default ProfileScreen;
