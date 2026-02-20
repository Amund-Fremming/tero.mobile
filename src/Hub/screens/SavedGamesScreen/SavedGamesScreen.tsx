import { View, Text, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./savedGameScreenStyles";
import VerticalScroll from "@/src/common/wrappers/VerticalScroll";
import { useEffect, useRef, useState } from "react";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { GameBase, GameCategory, GameEntryMode, GameType, PagedResponse } from "@/src/common/constants/Types";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "@/src/common/utils/dimensions";
import Color from "@/src/common/constants/Color";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import React from "react";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import Screen from "@/src/common/constants/Screen";
import { useSpinSessionProvider } from "@/src/spinGame/context/SpinGameProvider";
import { useQuizSessionProvider } from "@/src/quizGame/context/QuizGameProvider";
import { QuizSession } from "@/src/quizGame/constants/quizTypes";

const CATEGORY_LABELS: Record<GameCategory, string> = {
  [GameCategory.Girls]: "Jentene",
  [GameCategory.Boys]: "Gutta",
  [GameCategory.Mixed]: "Mixed",
  [GameCategory.InnerCircle]: "Indre krets",
};

const CATEGORY_ICONS: Record<GameCategory, any> = {
  [GameCategory.Girls]: "flower",
  [GameCategory.Boys]: "sword",
  [GameCategory.Mixed]: "glass-cocktail",
  [GameCategory.InnerCircle]: "account-group",
};

const GAME_TYPE_LABELS: Record<GameType, string> = {
  [GameType.Quiz]: "Quiz",
  [GameType.Roulette]: "Roulette",
  [GameType.Duel]: "Duel",
  [GameType.Imposter]: "Imposter",
  [GameType.Dice]: "Terning",
};

export const SavedGamesScreen = () => {
  const navigation: any = useNavigation();
  const { gameService } = useServiceProvider();
  const { accessToken, pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const { setIsHost, setGameKey, setHubAddress, setGameEntryMode, setIsDraft } = useGlobalSessionProvider();
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
  const [selectedGameType, setSelectedGameType] = useState<GameType>(GameType.Quiz);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchSavedGames(0, GameType.Quiz);
  }, []);

  const handleGameTypePress = async (gameType: GameType) => {
    if (gameType != selectedGameType) {
      setPageNum(0);
      setSelectedGameType(gameType);
      await fetchSavedGames(0, gameType);
    }
  };

  const handleUnsavePressed = async (game: GameBase) => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    setPagedResponse((prev) => ({ ...prev, items: prev.items.filter((g) => g.id != game.id) }));
    await gameService().unsaveGame(accessToken, game.id);
  };

  const fetchSavedGames = async (pageNum: number, gameType: GameType) => {
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
      const newPageNum = pageNum + 1;
      setPageNum(newPageNum);
      await fetchSavedGames(newPageNum, selectedGameType);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePrevPage = async () => {
    if (hasPrev) {
      const newPageNum = pageNum - 1;
      setPageNum(newPageNum);
      await fetchSavedGames(newPageNum, selectedGameType);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleGamePressed = async (gameId: string, gameType: GameType) => {
    if (!pseudoId) {
      // TODO handle
      console.error("Pseudo id was not present");
      return;
    }

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
        setGameKey(roulette.key);
        setHubAddress(roulette.hub_address);
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
        setGameKey(duel.key);
        setHubAddress(duel.hub_address);
        navigation.navigate(Screen.Spin);
        break;
      default:
        console.error("Oh yes this is bad. Game had unsupported type");
    }
  };

  const handleInfoPressed = () => {
    //
  };

  return (
    <View style={styles.container}>
      <VerticalScroll scrollRef={scrollRef}>
        <ScreenHeader
          title="Dine spill"
          onBackPressed={() => navigation.goBack()}
          onInfoPress={handleInfoPressed}
          backgroundColor={Color.White}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gameTypeScroll}
          contentContainerStyle={styles.gameTypeScrollContent}
        >
          {Object.values(GameType)
            .filter((g) => g !== GameType.Dice)
            .map((gameType) => (
              <Pressable
                key={gameType}
                style={[styles.gameTypeButton, selectedGameType === gameType && styles.gameTypeButtonActive]}
                onPress={() => handleGameTypePress(gameType)}
              >
                <Text style={[styles.gameTypeText, selectedGameType === gameType && styles.gameTypeTextActive]}>
                  {GAME_TYPE_LABELS[gameType]}
                </Text>
              </Pressable>
            ))}
        </ScrollView>

        {pagedResponse.items.length === 0 && <Text style={styles.noGames}>Du har ingen lagrede spill</Text>}

        {pagedResponse.items.map((game) => (
          <React.Fragment key={game.id}>
            <TouchableOpacity onPress={() => handleGamePressed(game.id, game.game_type)} style={styles.card}>
              <View style={styles.innerCard}>
                <MaterialCommunityIcons
                  name={CATEGORY_ICONS[game.category]}
                  size={moderateScale(60)}
                  color={Color.Gray}
                />

                <View style={styles.textWrapper}>
                  <Text style={styles.cardCategory}>{CATEGORY_LABELS[game.category]}</Text>
                  <Text style={styles.cardHeader}>{game.name}</Text>
                  <Text style={styles.cardDescription}>{game.iterations} runder</Text>
                </View>
              </View>
              <Pressable style={styles.saveIcon} onPress={() => handleUnsavePressed(game)}>
                <Feather name="x" size={30} color={Color.Gray} />
              </Pressable>
            </TouchableOpacity>
            <View style={styles.separator} />
          </React.Fragment>
        ))}

        {pagedResponse.items.length > 0 && (
          <View style={styles.pagination}>
            <Text style={styles.paragraph}>Side {pageNum}</Text>
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
