import GameCard from "@/src/core/components/GameCard/GameCard";
import { GameTypeIcon, GameTypeTabBar } from "@/src/core/components/GameTypeTabBar/GameTypeTabBar";
import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import VerticalScroll from "@/src/core/components/VerticalScroll/VerticalScroll";
import Color from "@/src/core/constants/Color";
import Screen from "@/src/core/constants/Screen";
import { GameBase, GameEntryMode, GameType, PagedResponse } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useSavedGamesProvider } from "@/src/core/context/SavedGamesProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { QuizSession } from "@/src/play/games/quizGame/constants/quizTypes";
import { useQuizSessionProvider } from "@/src/play/games/quizGame/context/QuizGameProvider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./savedGameScreenStyles";

const GAME_TYPES = Object.values(GameType).filter((g) => g !== GameType.Dice);

export const SavedGamesScreen = () => {
  const navigation: any = useNavigation();
  const { gameService } = useServiceProvider();
  const { accessToken, pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const {
    setIsHost,
    setSessionDataValues: setGameSessionValues,
    setGameEntryMode,
    setIsDraft,
  } = useGlobalSessionProvider();
  const { setQuizSession } = useQuizSessionProvider();

  const [pagedResponse, setPagedResponse] = useState<PagedResponse<GameBase>>({
    page_num: 0,
    items: [],
    has_next: false,
    has_prev: false,
  });
  const [pageNum, setPageNum] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const { refreshIds } = useSavedGamesProvider();

  useEffect(() => {
    fetchSavedGames(0, null);
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      refreshIds();
    }, [accessToken]),
  );

  const handleGameTypePress = async (gameType: GameType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = selectedGameType === gameType ? null : gameType;
    setPageNum(0);
    setSelectedGameType(next);
    await fetchSavedGames(0, next);
  };

  const handleUnsavePressed = async (game: GameBase) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    setPagedResponse((prev) => ({ ...prev, items: prev.items.filter((g) => g.id != game.id) }));
    await gameService().unsaveGame(accessToken, game.id);
  };

  const fetchSavedGames = async (pageNum: number, gameType: GameType | null) => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    const result = await gameService().getSavedGames(accessToken, pageNum, gameType);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    const page = result.value;
    setPagedResponse(page);
    setHasNext(page.has_next);
    setHasPrev(page.has_prev);
  };

  const handleNextPage = async () => {
    if (hasNext) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newPageNum = pageNum + 1;
      setPageNum(newPageNum);
      await fetchSavedGames(newPageNum, selectedGameType);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePrevPage = async () => {
    if (hasPrev) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newPageNum = pageNum - 1;
      setPageNum(newPageNum);
      await fetchSavedGames(newPageNum, selectedGameType);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleGamePressed = async (gameId: string, gameType: GameType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      default:
        console.error("Oh yes this is bad. Game had unsupported type");
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Dine spill" onBackPressed={() => navigation.goBack()} backgroundColor={Color.White} />
      <GameTypeTabBar
        types={GAME_TYPES}
        selectedType={selectedGameType}
        onTabPress={handleGameTypePress}
        showIcons
        activeColor={Color.HomeRed}
      />
      <VerticalScroll scrollRef={scrollRef}>
        {pagedResponse.items.length === 0 && <Text style={styles.noGames}>Du har ingen lagrede spill</Text>}

        {pagedResponse.items.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            icon={<GameTypeIcon type={game.game_type} size={moderateScale(60)} color={Color.Gray} />}
            deletable
            onPress={() => handleGamePressed(game.id, game.game_type)}
            onActionPress={() => handleUnsavePressed(game)}
          />
        ))}

        {pagedResponse.items.length > 0 && (
          <View style={styles.pagination}>
            <Text style={styles.paragraph}>Side {pageNum}</Text>
            <View style={styles.navButtons}>
              {hasPrev && (
                <TouchableOpacity style={hasNext ? styles.button : styles.buttonSingle} onPress={handlePrevPage}>
                  <Text style={styles.buttonLabel}>Forrige</Text>
                </TouchableOpacity>
              )}
              {hasNext && (
                <TouchableOpacity style={hasPrev ? styles.button : styles.buttonSingle} onPress={handleNextPage}>
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
