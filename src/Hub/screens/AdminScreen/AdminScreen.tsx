import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./AdminScreenStyles";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { screenHeight, verticalScale } from "@/src/common/utils/dimensions";
import Color from "@/src/common/constants/Color";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { ActivityStats, ClientPopup, LogCategoryCount, SystemHealth } from "@/src/common/constants/Types";
import Screen from "@/src/common/constants/Screen";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";

export const AdminScreen = () => {
  const navigation: any = useNavigation();
  const { redirectUri } = useAuthProvider();
  const { commonService, userService } = useServiceProvider();
  const { accessToken } = useAuthProvider();
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

      <Pressable onPress={handleErrorLogCardClick} style={styles.card}>
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
      </Pressable>

      <View style={styles.separator} />

      <View style={styles.card}>
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
        // TODO - load again button
        <View style={styles.card}>
          <Text style={styles.text}>Klarte ikke laste stats...</Text>
        </View>
      )}
      {stats && (
        <View style={styles.card}>
          <Text>Brukere</Text>
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
          <Text>Brukere</Text>
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

      <Pressable onPress={() => navigation.navigate(Screen.TipsList)} style={styles.card}>
        <Text style={styles.text}>Spill tips</Text>
        <Text></Text>
      </Pressable>

      <View style={styles.separator} />

      {!popup && (
        // TODO - load again button
        <View style={styles.card}>
          <Text style={styles.text}>Klarte ikke laste modal...</Text>
        </View>
      )}
      {popup && !popupEditing && (
        <View style={styles.card}>
          <Pressable style={styles.activeButton}>
            <Text style={styles.modalIndicator}>{popup.active ? "✅" : "❌"}</Text>
          </Pressable>
          <Text>Popup</Text>
          <Text style={styles.text}>{popup.heading}</Text>
          <Text style={styles.text}>{popup.paragraph}</Text>
          <Pressable onPress={() => setPopupEditing(true)} style={styles.popupButton}>
            <Text style={styles.popupText}>Rediger</Text>
          </Pressable>
        </View>
      )}

      {popup && popupEditing && (
        <View style={styles.card}>
          <Pressable
            onPress={() => setPopup((prev) => (prev ? { ...prev, active: !prev.active } : prev))}
            style={styles.activeButton}
          >
            <Text style={styles.modalIndicator}>{popup.active ? "✅" : "❌"}</Text>
          </Pressable>
          <Text>Popup</Text>
          <Text style={styles.text}>{popup.heading}</Text>
          <Text style={styles.text}>{popup.paragraph}</Text>
          <Pressable onPress={handleUpdateModal} style={styles.popupButton}>
            <Text style={styles.popupText}>Lagre</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default AdminScreen;
