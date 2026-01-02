import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./profileScreenStyles";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useEffect, useState } from "react";
import { BaseUser, UserRole } from "@/src/Common/constants/Types";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/Common/constants/Color";
import Screen from "@/src/Common/constants/Screen";
import { horizontalScale } from "@/src/Common/utils/dimensions";

export const ProfileScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId, triggerLogout, accessToken, setPseudoId, userData, setUserData } = useAuthProvider();
  const { userService } = useServiceProvider();

  const isLoggedIn = accessToken != null;

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");

  const crown = require("../../../Common/assets/images/crown.png");

  useEffect(() => {
    if (!pseudoId) {
      console.error("No user id");
      return;
    }

    setAvatar(userService().getProfilePicture(pseudoId, userData?.username));
  }, [userData]);

  useEffect(() => {
    fetchUserData();
  }, [accessToken]);

  const fetchUserData = async () => {
    if (!pseudoId) {
      console.error("No user id");
      return;
    }

    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    let result = await userService().getUser(accessToken);
    if (result.isError()) {
      return;
    }

    const role = result.value.role;
    const userData = result.value.user;
    setPseudoId(userData.id);
    setIsAdmin(role === UserRole.Admin);
    setUserData(userData);
    setAvatar(userService().getProfilePicture(pseudoId, userData.username));
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

  return (
    <View style={styles.container}>
      <View style={styles.iconsBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={32} color={Color.Black} />
        </Pressable>

        {isAdmin && (
          <Pressable onPress={() => navigation.navigate(Screen.Admin)} style={styles.adminButton}>
            <Text style={styles.adminText}>dashboard</Text>
          </Pressable>
        )}

        {isLoggedIn && (
          <Pressable onPress={handleLogout}>
            <Feather name="log-out" size={26} color={Color.Black} />
          </Pressable>
        )}
      </View>

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
            <Feather name="chevron-right" size={32} color={Color.Black} style={{ marginRight: horizontalScale(10) }} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate(Screen.ChangePassword)} style={styles.bigButton}>
            <View style={styles.iconGuard}>
              <Feather name="lock" size={28} color={Color.Black} />
            </View>
            <Text style={styles.buttonText}>Bytt passord</Text>
            <Feather name="chevron-right" size={32} color={Color.Black} style={{ marginRight: horizontalScale(10) }} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate(Screen.TipsUs)} style={styles.bigButton}>
            <View style={styles.iconGuard}>
              <Feather name="sun" size={28} color={Color.Black} />
            </View>
            <Text style={styles.buttonText}>Tips oss</Text>
            <Feather name="chevron-right" size={32} color={Color.Black} style={{ marginRight: horizontalScale(10) }} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate(Screen.SavedGames)} style={styles.bigButton}>
            <View style={styles.iconGuard}>
              <Feather name="play" size={28} color={Color.Black} />
            </View>
            <Text style={styles.buttonText}>Dine spill</Text>
            <Feather name="chevron-right" size={32} color={Color.Black} style={{ marginRight: horizontalScale(10) }} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
