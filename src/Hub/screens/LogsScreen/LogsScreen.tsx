import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./logsScreenStyles";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { screenHeight, verticalScale } from "@/src/common/utils/dimensions";
import Color from "@/src/common/constants/Color";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { SystemLog, LogCeverity, PagedResponse } from "@/src/common/constants/Types";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";

export const LogsScreen = () => {
  const navigation: any = useNavigation();
  const { accessToken } = useAuthProvider();
  const { commonService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();

  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LogCeverity | null>(null);
  const [pageNum, setPageNum] = useState<number>(0);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);

  useEffect(() => {
    getLogs(0, selectedCategory);
  }, [selectedCategory]);

  const getLogs = async (page: number, category: LogCeverity | null) => {
    if (!accessToken) {
      console.error("Access token was not present");
      return;
    }

    console.warn("Getting:", category);
    const result = await commonService().getLogs(accessToken, category, page);
    if (result.isError()) {
      displayErrorModal("Kunne ikke hente logger.");
      return;
    }

    const pagedResponse: PagedResponse<SystemLog> = result.value;
    setLogs(pagedResponse.items);
    setHasNext(pagedResponse.has_next);
  };

  const handleCategorySelect = (category: LogCeverity | null) => {
    setSelectedCategory(category);
    setPageNum(0);
    setHasPrev(false);
  };

  const handleNextPage = async () => {
    if (!hasNext) {
      return;
    }

    const page = pageNum + 1;
    setPageNum(page);
    setHasPrev(true);
    await getLogs(page, selectedCategory);
  };

  const handlePrevPage = async () => {
    if (pageNum === 0) {
      return;
    }

    if (pageNum === 1) {
      setHasPrev(false);
    }

    const page = pageNum - 1;
    setPageNum(page);
    await getLogs(page, selectedCategory);
  };

  const getCategoryColor = (category: LogCeverity): string => {
    switch (category) {
      case LogCeverity.Info:
        return Color.Green;
      case LogCeverity.Warning:
        return Color.BuzzifyOrange;
      case LogCeverity.Critical:
        return Color.Red;
      default:
        return Color.Gray;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("no-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <ScreenHeader title="Logs" onBackPressed={() => navigation.goBack()} backgroundColor={Color.LightGray} />

      <View style={styles.categoryBar}>
        <Pressable
          style={selectedCategory === null ? styles.categoryButtonActive : styles.categoryButton}
          onPress={() => handleCategorySelect(null)}
        >
          <Text style={selectedCategory === null ? styles.categoryTextActive : styles.categoryText}>Alle</Text>
        </Pressable>
        <Pressable
          style={selectedCategory === LogCeverity.Info ? styles.categoryButtonActive : styles.categoryButton}
          onPress={() => handleCategorySelect(LogCeverity.Info)}
        >
          <Text style={selectedCategory === LogCeverity.Info ? styles.categoryTextActive : styles.categoryText}>
            Info
          </Text>
        </Pressable>
        <Pressable
          style={selectedCategory === LogCeverity.Warning ? styles.categoryButtonActive : styles.categoryButton}
          onPress={() => handleCategorySelect(LogCeverity.Warning)}
        >
          <Text style={selectedCategory === LogCeverity.Warning ? styles.categoryTextActive : styles.categoryText}>
            Warning
          </Text>
        </Pressable>
        <Pressable
          style={selectedCategory === LogCeverity.Critical ? styles.categoryButtonActive : styles.categoryButton}
          onPress={() => handleCategorySelect(LogCeverity.Critical)}
        >
          <Text style={selectedCategory === LogCeverity.Critical ? styles.categoryTextActive : styles.categoryText}>
            Critical
          </Text>
        </Pressable>
      </View>

      <View style={styles.separator} />

      {logs.length === 0 && <Text style={styles.emptyText}>Ingen logger funnet</Text>}

      {logs.map((log) => (
        <>
          <View key={log.id} style={styles.logCard}>
            <Text style={[styles.logCategory, { color: getCategoryColor(log.ceverity) }]}>{log.ceverity}</Text>
            <Text style={styles.logMessage}>{log.description}</Text>
            <Text style={styles.logSource}>Action: {log.action}</Text>
            <Text style={styles.logSource}>Subject: {log.subject_type}</Text>
            {log.file_name && <Text style={styles.logSource}>Source: {log.file_name}</Text>}
            <Text style={styles.logTimestamp}>{formatTimestamp(log.created_at)}</Text>
          </View>
          <View style={styles.separator} />
        </>
      ))}

      {(hasPrev || hasNext) && (
        <View style={styles.navButtons}>
          {hasPrev && (
            <Pressable style={styles.navButton} onPress={handlePrevPage}>
              <Text style={styles.navButtonText}>Forrige</Text>
            </Pressable>
          )}
          {hasNext && (
            <Pressable style={styles.navButton} onPress={handleNextPage}>
              <Text style={styles.navButtonText}>Neste</Text>
            </Pressable>
          )}
        </View>
      )}

      {logs.length > 0 && <Text style={styles.pageInfo}>Side {pageNum + 1}</Text>}
    </ScrollView>
  );
};

export default LogsScreen;
