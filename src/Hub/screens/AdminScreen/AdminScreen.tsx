import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import styles from "./AdminScreenStyles";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { screenHeight, verticalScale, moderateScale } from "@/src/core/utils/dimensions";
import Color from "@/src/core/constants/Color";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { ActivityStats, ClientPopup, LogCategoryCount, SystemHealth } from "@/src/core/constants/Types";
import Screen from "@/src/core/constants/Screen";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

export const AdminScreen = () => {
  const navigation: any = useNavigation();
  const { redirectUri, accessToken } = useAuthProvider();
  const { commonService, userService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    platform: false,
    session: false,
    database: false,
  });
  const [logCategoryCount, setLogCategoryCount] = useState<LogCategoryCount>({
    info: 0,
    warning: 0,
    critical: 0,
  });
  const [stats, setStats] = useState<ActivityStats | undefined>(undefined);
  const [popup, setPopup] = useState<ClientPopup | undefined>(undefined);
  const [popupEditing, setPopupEditing] = useState<boolean>(false);

  useEffect(() => {
    getHealth();
    getUserActivityStats();
    getClientPopup();
    getLogCategoryCount();
  }, []);

  const getLogCategoryCount = async () => {
    if (!accessToken) {
      console.error("Access token was not present");
      return;
    }

    const result = await commonService().getLogCounts(accessToken);
    if (result.isError()) {
      displayErrorModal("Kunne ikke hente loggstatistikk.");
      return;
    }

    setLogCategoryCount(result.value);
  };

  const getHealth = async () => {
    const result = await commonService().healthDetailed();
    if (result.isError()) {
      console.error("Failed to contact health api");
      return;
    }

    setSystemHealth(result.value);
  };

  const getUserActivityStats = async () => {
    if (!accessToken) {
      console.error("Access token was not present!");
      return;
    }

    const result = await userService().getUserStats(accessToken);
    if (result.isError()) {
      console.error("Failed to load user activity stats");
      return;
    }

    setStats(result.value);
  };

  const getClientPopup = async () => {
    const result = await userService().getGlobalPopup();
    if (result.isError()) {
      console.error("Failed to load client popup");
      return;
    }

    setPopup(result.value);
  };

  const handleUpdateModal = async () => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    if (!popup) {
      console.warn("No popup model present");
      return;
    }

    const result = await userService().updateGlobalPopup(accessToken, popup);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    setPopup(result.value);
    setPopupEditing(false);
  };

  const handleErrorLogCardClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(Screen.Logs);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      style={{
        width: "100%",
        backgroundColor: Color.White,
        height: screenHeight(),
      }}
      contentContainerStyle={{
        alignItems: "center",
        gap: verticalScale(15),
        paddingBottom: verticalScale(200),
      }}
    >
      <ScreenHeader title="Admin" onBackPressed={() => navigation.goBack()} backgroundColor={Color.LightGray} />

      <Text style={styles.uri}>Redirect uri: {redirectUri}</Text>

      <View style={styles.separator} />

      <TouchableOpacity onPress={handleErrorLogCardClick} style={styles.card}>
        <Text style={styles.sectionTitle}>Logger</Text>
        <View style={styles.healthWrapper}>
          <Text style={styles.errorLogTextBold}>Info</Text>
          <Text style={[styles.errorLogTextBold, { color: Color.Green }]}>{logCategoryCount.info}</Text>
        </View>
        <View style={styles.healthWrapper}>
          <Text style={styles.errorLogTextBold}>Warning</Text>
          <Text style={[styles.errorLogTextBold, { color: Color.BuzzifyOrange }]}>{logCategoryCount.warning}</Text>
        </View>
        <View style={styles.healthWrapper}>
          <Text style={styles.errorLogTextBold}>Critical</Text>
          <Text style={[styles.errorLogTextBold, { color: Color.Red }]}>{logCategoryCount.critical}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Helse</Text>
        <View style={styles.healthWrapper}>
          <Text style={styles.text}>Platform</Text>
          <Text style={styles.text}>{systemHealth.platform ? "✅" : "❌"}</Text>
        </View>
        <View style={styles.healthWrapper}>
          <Text style={styles.text}>Database</Text>
          <Text style={styles.text}>{systemHealth.database ? "✅" : "❌"}</Text>
        </View>
        <View style={styles.healthWrapper}>
          <Text style={styles.text}>Session</Text>
          <Text style={styles.text}>{systemHealth.session ? "✅" : "❌"}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      {!stats && (
        <View style={styles.card}>
          <Text style={styles.text}>Klarte ikke laste stats...</Text>
        </View>
      )}
      {stats && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nylige Brukere</Text>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>I dag</Text>
            <Text style={styles.text}>{stats.recent.todays_users}</Text>
          </View>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>Denne uken</Text>
            <Text style={styles.text}>{stats.recent.this_week_users}</Text>
          </View>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>Denne måneden</Text>
            <Text style={styles.text}>{stats.recent.this_month_users}</Text>
          </View>
        </View>
      )}

      <View style={styles.separator} />

      {stats && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Gjennomsnitt Brukere</Text>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>Daglig</Text>
            <Text style={styles.text}>{stats.average.avg_daily_users}</Text>
          </View>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>Ukentlig</Text>
            <Text style={styles.text}>{stats.average.avg_daily_users}</Text>
          </View>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>Månedlig</Text>
            <Text style={styles.text}>{stats.average.avg_month_users}</Text>
          </View>
          <View style={styles.healthWrapper}>
            <Text style={styles.text}>Totalt</Text>
            <Text style={styles.text}>{stats.total_user_count}</Text>
          </View>
        </View>
      )}

      <View style={styles.separator} />

      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate(Screen.TipsList);
        }}
        style={styles.card}
      >
        <Text style={styles.sectionTitle}>Spill Tips</Text>
        <Text style={styles.text}>Administrer spill tips</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      {!popup && (
        <View style={styles.card}>
          <Text style={styles.text}>Klarte ikke laste modal...</Text>
        </View>
      )}
      {popup && !popupEditing && (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPopup((prev) => (prev ? { ...prev, active: !prev.active } : prev));
            }}
            style={[styles.toggleButton, popup.active ? styles.toggleButtonActive : styles.toggleButtonInactive]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.toggleText, popup.active ? styles.toggleTextActive : styles.toggleTextInactive]}>
              {popup.active ? "PÅ" : "AV"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Popup Melding</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Tittel</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>{popup.heading}</Text>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Beskrivelse</Text>
            <View style={[styles.inputContainer, styles.multilineInputContainer]}>
              <Text style={styles.text}>{popup.paragraph}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPopupEditing(true);
            }}
            style={styles.popupButton}
          >
            <Text style={styles.popupText}>Rediger</Text>
          </TouchableOpacity>
        </View>
      )}

      {popup && popupEditing && (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPopup((prev) => (prev ? { ...prev, active: !prev.active } : prev));
            }}
            style={[styles.toggleButton, popup.active ? styles.toggleButtonActive : styles.toggleButtonInactive]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.toggleText, popup.active ? styles.toggleTextActive : styles.toggleTextInactive]}>
              {popup.active ? "PÅ" : "AV"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Rediger Popup</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Tittel</Text>
            <View style={styles.inputContainer}>
              <Feather
                name="type"
                size={moderateScale(18)}
                color={Color.DarkerGray}
                style={{ paddingRight: moderateScale(8) }}
              />
              <TextInput
                style={styles.input}
                value={popup.heading}
                onChangeText={(text) => setPopup((prev) => (prev ? { ...prev, heading: text } : prev))}
                placeholder="Tittel"
                placeholderTextColor={Color.DarkerGray}
              />
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Beskrivelse</Text>
            <View style={[styles.inputContainer, styles.multilineInputContainer]}>
              <Feather
                name="edit-3"
                size={moderateScale(18)}
                color={Color.DarkerGray}
                style={{ paddingRight: moderateScale(8), alignSelf: "flex-start", paddingTop: moderateScale(2) }}
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={popup.paragraph}
                onChangeText={(text) => setPopup((prev) => (prev ? { ...prev, paragraph: text } : prev))}
                placeholder="Beskrivelse"
                placeholderTextColor={Color.DarkerGray}
                multiline
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPopupEditing(false);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Avbryt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleUpdateModal();
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Lagre</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AdminScreen;
