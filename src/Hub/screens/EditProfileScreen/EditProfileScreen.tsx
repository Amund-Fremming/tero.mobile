import { Pressable, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./editProfileScreenStyles";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useEffect, useState } from "react";
import { BaseUser, Gender, PatchUserRequest } from "@/src/Common/constants/Types";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/Common/constants/Color";
import { TextInput } from "react-native-gesture-handler";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import ScreenHeader from "@/src/Common/components/ScreenHeader/ScreenHeader";
import { moderateScale } from "@/src/Common/utils/dimensions";

export const EditProfileScreen = () => {
  const navigation: any = useNavigation();

  const { accessToken, userData, setUserData } = useAuthProvider();
  const { userService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();

  const [patchRequest, setPatchRequest] = useState<PatchUserRequest>({});
  const [birthDateDisplay, setBirthDateDisplay] = useState<string>("");

  const handleBirthDateChangeIso = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const limited = cleaned.slice(0, 8);

    let formatted = limited;
    if (limited.length >= 5) {
      formatted = limited.slice(0, 4) + "-" + limited.slice(4);
    }
    if (limited.length >= 7) {
      formatted = limited.slice(0, 4) + "-" + limited.slice(4, 6) + "-" + limited.slice(6);
    }

    setBirthDateDisplay(formatted);
    if (limited.length === 8) {
      const year = parseInt(limited.slice(0, 4), 10);
      const month = parseInt(limited.slice(4, 6), 10);
      const day = parseInt(limited.slice(6, 8), 10);

      if (year >= 1900 && year <= new Date().getFullYear() && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const date = new Date(year, month - 1, day);

        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
          const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          setPatchRequest((prev) => ({
            ...prev,
            birth_date: isoDate,
          }));
          return;
        }
      }
    }

    setPatchRequest((prev) => ({
      ...prev,
      birth_date: undefined,
    }));
  };

  useEffect(() => {
    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    setPatchRequest({
      username: userData?.username,
      gender: userData?.gender,
      family_name: userData?.family_name,
      given_name: userData?.given_name,
      birth_date: userData?.birth_date,
    });

    if (userData?.birth_date) {
      setBirthDateDisplay(userData.birth_date);
    }
  }, [userData]);

  const fetchUserData = async () => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    const result = await userService().getUser(accessToken);
    if (result.isError()) {
      return;
    }

    const userData = result.value.user;
    setUserData(userData);
    return;
  };

  const handlePatchUser = async () => {
    if (!accessToken) {
      console.error("No access token present");
      return;
    }

    if (!userData) {
      console.error("No user data present");
      return;
    }

    const result = await userService().patchUser(accessToken, userData?.id, patchRequest);
    if (result.isError()) {
      displayErrorModal("Ugyldige felt.");
      return;
    }

    const user = result.value;
    setUserData(user);
    navigation.goBack();
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Rediger"
        backgroundColor={Color.LightGray}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.email}>{userData?.email}</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="user"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              onChangeText={(input) => setPatchRequest((prev) => ({ ...prev, given_name: input }))}
              style={styles.input}
              value={patchRequest.given_name}
              placeholder="Fornavn"
              placeholderTextColor={Color.DarkerGray}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="user"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              onChangeText={(input) => setPatchRequest((prev) => ({ ...prev, family_name: input }))}
              style={styles.input}
              value={patchRequest.family_name}
              placeholder="Etternavn"
              placeholderTextColor={Color.DarkerGray}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="at-sign"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              onChangeText={(input) => setPatchRequest((prev) => ({ ...prev, username: input }))}
              style={styles.input}
              value={patchRequest.username}
              placeholder="Brukernavn"
              placeholderTextColor={Color.DarkerGray}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="calendar"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.input}
              value={birthDateDisplay}
              onChangeText={handleBirthDateChangeIso}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Color.DarkerGray}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.genderLabel}>Kjønn</Text>
          <View style={styles.genderButtonContainer}>
            <Pressable
              style={[styles.genderButton, patchRequest?.gender === Gender.Male && styles.genderButtonSelected]}
              onPress={() => setPatchRequest((prev) => ({ ...prev, gender: Gender.Male }))}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  patchRequest?.gender === Gender.Male && styles.genderButtonTextSelected,
                ]}
              >
                Mann
              </Text>
            </Pressable>
            <Pressable
              style={[styles.genderButton, patchRequest?.gender === Gender.Female && styles.genderButtonSelected]}
              onPress={() => setPatchRequest((prev) => ({ ...prev, gender: Gender.Female }))}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  patchRequest?.gender === Gender.Female && styles.genderButtonTextSelected,
                ]}
              >
                Kvinne
              </Text>
            </Pressable>
            <Pressable
              style={[styles.genderButton, patchRequest?.gender === Gender.Unknown && styles.genderButtonSelected]}
              onPress={() => setPatchRequest((prev) => ({ ...prev, gender: Gender.Unknown }))}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  (userData == undefined || userData?.gender === Gender.Unknown) && styles.genderButtonTextSelected,
                ]}
              >
                Annet
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={handlePatchUser} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lagre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
