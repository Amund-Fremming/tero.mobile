import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./logsScreenStyles";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import Color from "@/src/Common/constants/Color";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { SystemLog, LogCeverity, PagedResponse } from "@/src/Common/constants/Types";
import ScreenHeader from "@/src/Common/components/ScreenHeader/ScreenHeader";
import VerticalScroll from "@/src/Common/wrappers/VerticalScroll";

export const LogsScreen = () => {
  const navigation: any = useNavigation();
  const { accessToken } = useAuthProvider();
  const { commonService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();
  const scrollRef = useRef<ScrollView>(null);

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
    scrollRef.current?.scrollTo({ y: 0, animated: true });
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
    scrollRef.current?.scrollTo({ y: 0, animated: true });
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
    <View style={styles.container}>
      <VerticalScroll scrollRef={scrollRef}>
        <ScreenHeader title="Logs" onBackPressed={() => navigation.goBack()} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          <Pressable
            style={[styles.categoryButton, selectedCategory === null && styles.categoryButtonActive]}
            onPress={() => handleCategorySelect(null)}
          >
            <Text style={[styles.categoryText, selectedCategory === null && styles.categoryTextActive]}>Alle</Text>
          </Pressable>
          <Pressable
            style={[styles.categoryButton, selectedCategory === LogCeverity.Info && styles.categoryButtonActive]}
            onPress={() => handleCategorySelect(LogCeverity.Info)}
          >
            <Text style={[styles.categoryText, selectedCategory === LogCeverity.Info && styles.categoryTextActive]}>
              Info
            </Text>
          </Pressable>
          <Pressable
            style={[styles.categoryButton, selectedCategory === LogCeverity.Warning && styles.categoryButtonActive]}
            onPress={() => handleCategorySelect(LogCeverity.Warning)}
          >
            <Text style={[styles.categoryText, selectedCategory === LogCeverity.Warning && styles.categoryTextActive]}>
              Warning
            </Text>
          </Pressable>
          <Pressable
            style={[styles.categoryButton, selectedCategory === LogCeverity.Critical && styles.categoryButtonActive]}
            onPress={() => handleCategorySelect(LogCeverity.Critical)}
          >
            <Text style={[styles.categoryText, selectedCategory === LogCeverity.Critical && styles.categoryTextActive]}>
              Critical
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.separator} />

        {logs.length === 0 && <Text style={styles.emptyText}>Ingen logger funnet</Text>}

        {logs.map((log) => (
          <React.Fragment key={log.id}>
            <View key={log.id} style={styles.logCard}>
              <Text style={[styles.logCategory, { color: getCategoryColor(log.ceverity) }]}>{log.ceverity}</Text>
              <Text style={styles.logMessage}>{log.description}</Text>
              <Text style={styles.logSource}>Action: {log.action}</Text>
              <Text style={styles.logSource}>Subject: {log.subject_type}</Text>
              {log.file_name && <Text style={styles.logSource}>Source: {log.file_name}</Text>}
              <Text style={styles.logTimestamp}>{formatTimestamp(log.created_at)}</Text>
            </View>
            <View style={styles.separator} />
          </React.Fragment>
        ))}

        {(hasPrev || hasNext) && (
          <View style={styles.pagination}>
            <Text style={styles.pageInfo}>Side {pageNum + 1}</Text>
            <View style={styles.navButtons}>
              {hasPrev && (
                <Pressable style={hasNext ? styles.button : styles.buttonSingle} onPress={handlePrevPage}>
                  <Text style={styles.buttonLabel}>Forrige</Text>
                </Pressable>
              )}
              {hasNext && (
                <Pressable style={hasPrev ? styles.button : styles.buttonSingle} onPress={handleNextPage}>
                  <Text style={styles.buttonLabel}>Neste</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </VerticalScroll>
    </View>
  );
};

export default LogsScreen;
