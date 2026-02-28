import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import VerticalScroll from "../../../core/components/VerticalScroll/VerticalScroll";
import { useEffect, useRef, useState } from "react";
import { useModalProvider } from "../../../core/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { useAuthProvider } from "../../../core/context/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useQuizSessionProvider } from "@/src/play/games/quizGame/context/QuizGameProvider";
import styles from "./gameListScreenStyles";
import { useServiceProvider } from "../../../core/context/ServiceProvider";
import {
  GameBase,
  GameCategory,
  GameEntryMode,
  GamePagedRequest,
  GameType,
  PagedResponse,
} from "../../../core/constants/Types";
import Screen from "../../../core/constants/Screen";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Color from "../../../core/constants/Color";
import { QuizSession } from "@/src/play/games/quizGame/constants/quizTypes";
import { moderateScale } from "../../../core/utils/dimensions";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import React from "react";
import { ImposterSession } from "../../games/imposter/constants/imposterTypes";
import { useImposterSessionProvider } from "../../games/imposter/context/ImposterSessionProvider";

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

export const GameListScreen = () => {
  const navigation: any = useNavigation();

  const { setImposterSession } = useImposterSessionProvider();
  const { setQuizSession } = useQuizSessionProvider();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { displayErrorModal, displayActionModal } = useModalProvider();
  const { pseudoId, accessToken, triggerLogin } = useAuthProvider();
  const { gameType, setGameKey, setHubName, setIsHost, setIsDraft } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const getHeaderBg = () => {
    switch (gameType) {
      case GameType.Imposter:
        return Color.BuzzifyLavender;
      case GameType.Duel:
        return Color.BeigeLight;
      case GameType.Roulette:
        return Color.SkyBlueLight;
      case GameType.Quiz:
        return Color.LighterGreen;
      default:
        return Color.LightGray;
    }
  };

  const [pagedResponse, setPagedResponse] = useState<PagedResponse<GameBase>>({
    items: [],
    has_next: false,
    has_prev: false,
    page_num: 1,
  });
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [headerBg] = useState<string>(getHeaderBg);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getPage(0);
  }, []);

  const handleNextPage = async () => {
    if (!pagedResponse.has_next) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await getPage(pagedResponse.page_num + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handlePrevPage = async () => {
    if (!pagedResponse.has_prev) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await getPage(pagedResponse.page_num - 1);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const createPageQuery = (pageNum: number): GamePagedRequest => {
    return {
      page_num: pageNum,
      game_type: gameType,
      category: category,
    };
  };

  const getPage = async (pageNum: number) => {
    const request = createPageQuery(pageNum);
    const result = await gameService().getGamePage<GameBase>(pseudoId, request);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    setPagedResponse(result.value);
  };

  const handleSaveGame = async (gameId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!accessToken) {
      displayActionModal(
        "Du må logge inn for å lagre spill",
        () => {
          navigation.navigate(Screen.Hub);
          // Small delay to ensure navigation completes
          setTimeout(() => triggerLogin(), 200);
        },
        () => {},
      );
      return;
    }

    const result = await gameService().saveGame(accessToken, gameId);
    if (result.isError()) {
      displayErrorModal("Noe gikk galt. Prøv igjen.");
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
        setGameKey(roulette.key);
        setHubName(roulette.hub_name);
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
        setGameKey(duel.key);
        setHubName(duel.hub_name);
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
      <VerticalScroll scrollRef={scrollRef}>
        <ScreenHeader
          title="Velg spill"
          onBackPressed={() => navigation.goBack()}
          onInfoPress={handleInfoPressed}
          backgroundColor={headerBg}
        />

        {pagedResponse.items.length === 0 && (
          <Text style={styles.noGames}>Det finnes ingen spill av denne typen enda</Text>
        )}

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
              <TouchableOpacity style={styles.saveIcon} onPress={() => handleSaveGame(game.id)}>
                <Feather name="bookmark" size={26} color={Color.Gray} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.separator} />
          </React.Fragment>
        ))}

        <View style={styles.pagination}>
          <Text style={styles.paragraph}>Side {pagedResponse.page_num}</Text>
          <View style={styles.navButtons}>
            {pagedResponse.has_prev && (
              <TouchableOpacity
                style={pagedResponse.has_next ? styles.button : styles.buttonSingle}
                onPress={handlePrevPage}
              >
                <Text style={styles.buttonLabel}>Forrige</Text>
              </TouchableOpacity>
            )}
            {pagedResponse.has_next && (
              <TouchableOpacity
                style={pagedResponse.has_prev ? styles.button : styles.buttonSingle}
                onPress={handleNextPage}
              >
                <Text style={styles.buttonLabel}>Neste</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </VerticalScroll>
    </View>
  );
};

export default GameListScreen;
