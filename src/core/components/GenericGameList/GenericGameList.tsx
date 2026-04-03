import GameCard from "@/src/core/components/GameCard/GameCard";
import { GameTypeIcon, GameTypeTabBar } from "@/src/core/components/GameTypeTabBar/GameTypeTabBar";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import VerticalScroll from "@/src/core/components/VerticalScroll/VerticalScroll";
import Color from "@/src/core/constants/Color";
import Screen from "@/src/core/constants/Screen";
import { GameBase, GameEntryMode, GameType, PagedResponse } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { ImposterSession } from "@/src/play/games/imposter/constants/imposterTypes";
import { useImposterSessionProvider } from "@/src/play/games/imposter/context/ImposterSessionProvider";
import { QuizSession } from "@/src/play/games/quiz/constants/quizTypes";
import { useQuizSessionProvider } from "@/src/play/games/quiz/context/QuizGameProvider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./genericGameListStyles";

interface CardAction {
  saved?: boolean;
  deletable?: boolean;
  onActionPress: () => void;
}

interface GenericGameListProps {
  title: string;
  headerBackgroundColor: string;
  emptyMessage: string;
  gameTypes: GameType[];
  fetchPage: (pageNum: number, gameType: GameType | null) => Promise<PagedResponse<GameBase> | null>;
  renderCardAction: (game: GameBase) => CardAction;
  showSkeleton?: boolean;
  onInfoPress?: () => void;
  refreshOnFocus?: () => void;
  initialPage?: PagedResponse<GameBase>;
}

const SkeletonCard = memo(() => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <View style={styles.card}>
        <View style={styles.innerCard}>
          <View style={styles.skeletonIcon} />
          <View style={styles.textWrapper}>
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLineLong} />
            <View style={styles.skeletonLineMedium} />
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </Animated.View>
  );
});

export const GenericGameList = ({
  title,
  headerBackgroundColor,
  emptyMessage,
  gameTypes,
  fetchPage,
  renderCardAction,
  showSkeleton = true,
  onInfoPress,
  refreshOnFocus,
  initialPage,
}: GenericGameListProps) => {
  const navigation: any = useNavigation();
  const { gameService } = useServiceProvider();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const {
    setGameType,
    setSessionDataValues: setGameSessionValues,
    setIsHost,
    setGameEntryMode,
    setIsDraft,
  } = useGlobalSessionProvider();
  const { setQuizSession } = useQuizSessionProvider();
  const { setImposterSession } = useImposterSessionProvider();
  const { theme } = useThemeProvider();

  const [pagedResponse, setPagedResponse] = useState<PagedResponse<GameBase>>(
    initialPage ?? { items: [], has_next: false, has_prev: false, page_num: 0 },
  );
  const [loading, setLoading] = useState(showSkeleton && !initialPage);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!initialPage) loadPage(0, null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshOnFocus?.();
    }, [refreshOnFocus]),
  );

  const loadPage = async (pageNum: number, gameType: GameType | null) => {
    if (showSkeleton) setLoading(true);
    const result = await fetchPage(pageNum, gameType);
    if (result) {
      setPagedResponse(result);
    }
    if (showSkeleton) setLoading(false);
  };

  const handleTabPress = (type: GameType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedGameType === type) {
      setSelectedGameType(null);
      loadPage(0, null);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }

    setSelectedGameType(type);
    loadPage(0, type);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleNextPage = async () => {
    if (!pagedResponse.has_next) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadPage(pagedResponse.page_num + 1, selectedGameType);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handlePrevPage = async () => {
    if (!pagedResponse.has_prev) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadPage(pagedResponse.page_num - 1, selectedGameType);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleGamePressed = async (gameId: string, gameType: GameType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGameType(gameType);
    switch (gameType) {
      case GameType.Quiz:
        setGameEntryMode(GameEntryMode.Host);
        const qResult = await gameService().initiateStaticGame<QuizSession>(gameType, gameId, pseudoId);
        if (qResult.isError()) {
          displayErrorModal("Kunne ikke hente spill.");
          return;
        }
        setQuizSession(qResult.value);
        navigation.navigate(Screen.Quiz);
        break;
      case GameType.Roulette:
        setIsHost(true);
        setGameEntryMode(GameEntryMode.Host);
        const rResult = await gameService().initiateSessionGame(pseudoId, gameType, gameId);
        if (rResult.isError()) {
          displayErrorModal("Kunne ikke hente spill.");
          return;
        }
        const roulette = rResult.value;
        setIsDraft(roulette.is_draft);
        setGameSessionValues(roulette.key, roulette.hub_name, roulette.game_id);
        navigation.navigate(Screen.Spin);
        break;
      case GameType.Duel:
        setIsHost(true);
        setGameEntryMode(GameEntryMode.Host);
        const dResult = await gameService().initiateSessionGame(pseudoId, gameType, gameId);
        if (dResult.isError()) {
          displayErrorModal("Kunne ikke hente spill.");
          return;
        }
        const duel = dResult.value;
        setIsDraft(duel.is_draft);
        setGameSessionValues(duel.key, duel.hub_name, duel.game_id);
        navigation.navigate(Screen.Spin);
        break;
      case GameType.Imposter:
        setIsHost(true);
        setGameEntryMode(GameEntryMode.Host);
        const iResult = await gameService().initiateStaticGame<ImposterSession>(gameType, gameId, pseudoId);
        if (iResult.isError()) {
          displayErrorModal("Kunne ikke hente spill.");
          return;
        }
        const imposter = iResult.value;
        setImposterSession(imposter);
        navigation.navigate(Screen.Imposter);
        break;
      default:
        console.error("Oh yes this is bad. Game had unsupported type");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ScreenHeader
        title={title}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={onInfoPress}
        backgroundColor={headerBackgroundColor}
      />
      <GameTypeTabBar
        types={gameTypes}
        selectedType={selectedGameType}
        onTabPress={handleTabPress}
        showIcons
        activeColor={Color.HomeRed}
      />
      <VerticalScroll scrollRef={scrollRef}>
        {!loading && pagedResponse.items.length === 0 && <Text style={styles.noGames}>{emptyMessage}</Text>}

        {loading && showSkeleton
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : pagedResponse.items.map((game) => {
              const action = renderCardAction(game);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  icon={<GameTypeIcon type={game.game_type} size={moderateScale(60)} color={Color.Gray} />}
                  saved={action.saved}
                  deletable={action.deletable}
                  onPress={() => handleGamePressed(game.id, game.game_type)}
                  onActionPress={action.onActionPress}
                />
              );
            })}

        {!loading && (
          <View style={styles.pagination}>
            <Text style={styles.paragraph}>Side {pagedResponse.page_num}</Text>
            <View style={styles.navButtons}>
              {pagedResponse.has_prev && (
                <TouchableOpacity
                  style={pagedResponse.has_next ? styles.buttonInverted : styles.buttonSingleLeft}
                  onPress={handlePrevPage}
                >
                  <Text style={pagedResponse.has_next ? styles.buttonLabelInverted : styles.buttonLabel}>Forrige</Text>
                </TouchableOpacity>
              )}
              {pagedResponse.has_next && (
                <TouchableOpacity
                  style={pagedResponse.has_prev ? styles.button : styles.buttonSingleRight}
                  onPress={handleNextPage}
                >
                  <Text style={styles.buttonLabel}>Neste</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </VerticalScroll>
    </View>
  );
};
