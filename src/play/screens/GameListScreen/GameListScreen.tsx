import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { QuizSession } from "@/src/play/games/quizGame/constants/quizTypes";
import { useQuizSessionProvider } from "@/src/play/games/quizGame/context/QuizGameProvider";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import GameCard from "../../../core/components/GameCard/GameCard";
import { GameTypeIcon, GameTypeTabBar } from "../../../core/components/GameTypeTabBar/GameTypeTabBar";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import VerticalScroll from "../../../core/components/VerticalScroll/VerticalScroll";
import Color from "../../../core/constants/Color";
import Screen from "../../../core/constants/Screen";
import {
  GameBase,
  GameCategory,
  GameEntryMode,
  GamePagedRequest,
  GameType,
  PagedResponse,
} from "../../../core/constants/Types";
import { useAuthProvider } from "../../../core/context/AuthProvider";
import { useModalProvider } from "../../../core/context/ModalProvider";
import { useSavedGamesProvider } from "../../../core/context/SavedGamesProvider";
import { useServiceProvider } from "../../../core/context/ServiceProvider";
import { useToastProvider } from "../../../core/context/ToastProvider";
import { moderateScale } from "../../../core/utils/dimensions";
import { ImposterSession } from "../../games/imposter/constants/imposterTypes";
import { useImposterSessionProvider } from "../../games/imposter/context/ImposterSessionProvider";
import styles from "./gameListScreenStyles";

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

const GAME_TYPES = [GameType.Quiz, GameType.Roulette, GameType.Duel, GameType.Imposter];

export const GameListScreen = () => {
  const navigation: any = useNavigation();

  const { setImposterSession } = useImposterSessionProvider();
  const { setQuizSession } = useQuizSessionProvider();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { displayErrorModal, displayActionModal } = useModalProvider();
  const { displayToast } = useToastProvider();
  const { pseudoId, accessToken, triggerLogin } = useAuthProvider();
  const { savedIdSet, saveGame: saveGameToSet } = useSavedGamesProvider();
  const { setGameType, setSessionDataValues: setGameSessionValues, setIsHost, setIsDraft } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const [pagedResponse, setPagedResponse] = useState<PagedResponse<GameBase>>({
    items: [],
    has_next: false,
    has_prev: false,
    page_num: 1,
  });

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getPage(0, null);
  }, []);

  const handleNextPage = async () => {
    if (!pagedResponse.has_next) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await getPage(pagedResponse.page_num + 1, selectedGameType);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handlePrevPage = async () => {
    if (!pagedResponse.has_prev) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await getPage(pagedResponse.page_num - 1, selectedGameType);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const createPageQuery = (pageNum: number, gameTypeFilter: GameType | null): GamePagedRequest => {
    return {
      page_num: pageNum,
      game_type: gameTypeFilter,
      category: category,
    };
  };

  const handleTabPress = (type: GameType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedGameType === type) {
      setSelectedGameType(null);
      getPage(0, null);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }

    setSelectedGameType(type);
    getPage(0, type);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const getPage = async (pageNum: number, gameTypeFilter: GameType | null) => {
    setLoading(true);
    const request = createPageQuery(pageNum, gameTypeFilter);
    const result = await gameService().getGamePage<GameBase>(pseudoId, request);
    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    setPagedResponse(result.value);
    setLoading(false);
  };

  const handleSaveGame = async (gameId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!accessToken) {
      displayActionModal(
        "Du må logge inn for å lagre spill",
        () => {
          navigation.navigate(Screen.Hub);
          setTimeout(() => triggerLogin(), 200);
        },
        () => {},
      );
      return;
    }

    if (savedIdSet.has(gameId)) return;

    await saveGameToSet(gameId);
    displayToast(2.2);
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

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Velg spill"
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
        backgroundColor={Color.BuzzifyLavender}
      />
      <GameTypeTabBar
        types={GAME_TYPES}
        selectedType={selectedGameType}
        onTabPress={handleTabPress}
        showIcons
        activeColor={Color.HomeRed}
      />
      <VerticalScroll scrollRef={scrollRef}>
        {!loading && pagedResponse.items.length === 0 && (
          <Text style={styles.noGames}>Det finnes ingen spill av denne typen enda</Text>
        )}

        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : pagedResponse.items.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                icon={<GameTypeIcon type={game.game_type} size={moderateScale(60)} color={Color.Gray} />}
                saved={savedIdSet.has(game.id)}
                onPress={() => handleGamePressed(game.id, game.game_type)}
                onActionPress={() => handleSaveGame(game.id)}
              />
            ))}

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

export default GameListScreen;
