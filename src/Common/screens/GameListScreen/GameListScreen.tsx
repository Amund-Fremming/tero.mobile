import { Pressable, Text, View, TouchableOpacity } from "react-native";
import VerticalScroll from "../../wrappers/VerticalScroll";
import { useEffect, useState } from "react";
import { useModalProvider } from "../../context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useAuthProvider } from "../../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useQuizGameProvider } from "@/src/quizGame/context/QuizGameProvider";
import styles from "./gameListScreenStyles";
import { useServiceProvider } from "../../context/ServiceProvider";
import { GameBase, GameCategory, GameEntryMode, GamePageQuery, GameType, PagedResponse } from "../../constants/Types";
import Screen from "../../constants/Screen";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Color from "../../constants/Color";
import { QuizSession } from "@/src/quizGame/constants/quizTypes";
import { moderateScale } from "../../utils/dimensions";
import Icon from 'react-native-ico-rpg-game';

const CATEGORY_LABELS: Record<GameCategory, string> = {
  [GameCategory.All]: "All",
  [GameCategory.Ladies]: "Jenter",
  [GameCategory.Boys]: "Gutter",
  [GameCategory.Vors]: "Vors",
};

const CATEGORY_ICONS: Record<GameCategory, any> = {
  [GameCategory.All]: "account-group",
  [GameCategory.Ladies]: "flower",
  [GameCategory.Boys]: "sword",
  [GameCategory.Vors]: "glass-cocktail",
};

export const GameListScreen = () => {
  const navigation: any = useNavigation();

  const { setQuizSession } = useQuizGameProvider();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { displayErrorModal, displayActionModal } = useModalProvider();
  const { pseudoId, accessToken, triggerLogin } = useAuthProvider();
  const { gameType, setGameKey, setHubAddress, setIsHost } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();

  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState<number>(0);
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [games, setGames] = useState<GameBase[]>([]);

  useEffect(() => {
    getPage(0);
  }, []);

  const handleNextPage = async () => {
    if (!hasNext) {
      return;
    }

    const page = pageNum + 1;
    setPageNum(page);
    setHasPrev(true);
    await getPage(page);
  };

  const handlePrevPage = async () => {
    if (pageNum == 0) {
      return;
    }

    if (pageNum == 1) {
      setHasPrev(false);
    }

    const page = pageNum - 1;
    setPageNum(page);
    await getPage(page);
  };

  const createPageQuery = (pageNum: number): GamePageQuery => {
    return {
      page_num: pageNum,
      game_type: gameType,
      category: category,
    };
  };

  const getPage = async (pageNum: number) => {
    if (!pseudoId) {
      // TODO handle
      console.error("No user id");
      return;
    }

    const request = createPageQuery(pageNum);
    const result = await gameService().getGamePage<GameBase>(pseudoId, request);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    const pagedResponse: PagedResponse<GameBase> = result.value;

    console.log("has next:", pagedResponse.has_next);
    setGames(pagedResponse.items);
    setHasNext(pagedResponse.has_next);
  };

  const handleSaveGame = async (gameId: string) => {
    if (!accessToken) {
      displayActionModal(
        "Du må logge inn for å lagre spill",
        () => {
          navigation.navigate(Screen.Hub);
          // Small delay to ensure navigation completes
          setTimeout(() => triggerLogin(), 200);
        },
        () => { },
      );
      return;
    }

    const result = await gameService().saveGame(accessToken, gameId);
    if (result.isError()) {
      displayErrorModal("Det har skjedd en feil, forsøk igjen senere");
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
        const qResult = await gameService().initiateStaticGame<QuizSession>(gameType, gameId, pseudoId);
        if (qResult.isError()) {
          displayErrorModal("Klarte ikke hente spillet, prøv igjen senere");
          return;
        }

        setQuizSession(qResult.value);
        setGameEntryMode(GameEntryMode.Host);
        navigation.navigate(Screen.Quiz);
        break;
      case GameType.Roulette:
        const rResult = await gameService().initiateSessionGame(pseudoId, gameType, gameId);
        if (rResult.isError()) {
          displayErrorModal("Klarte ikke hente spillet, prøv igjen senere");
          return;
        }

        setIsHost(true);
        let roulette = rResult.value;
        setGameKey(roulette.key);
        setHubAddress(roulette.hub_address);
        setGameEntryMode(GameEntryMode.Host);
        navigation.navigate(Screen.Spin);
        break;
      case GameType.Duel:
        // TODO HANDLE
        break;
      default:
        console.error("Oh yes this is bad. Game had unsupported type");
    }
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  }

  return (
    <View style={styles.container}>
      <VerticalScroll>
        <View style={styles.topWrapper}>
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
              <Feather name="chevron-left" size={moderateScale(45)} />
            </TouchableOpacity>
            <View style={styles.borderAndHeader}>
              <Text style={styles.header}>Velg spill</Text>
              <View style={styles.borderWrapper}>
                <View style={styles.borderLeft} />
                <View style={styles.borderRight} />
              </View>
            </View>
            <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
              <Text style={styles.textIcon}>?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {games.length === 0 && <Text>Det finnes ingen spill av denne typen enda</Text>}

        {games.map((game) => (
          <TouchableOpacity
            onPress={() => handleGamePressed(game.id, game.game_type)}
            key={game.id}
            style={styles.card}
          >
            <View style={styles.innerCard}>
              <MaterialCommunityIcons name={CATEGORY_ICONS[game.category]} size={moderateScale(60)} color={Color.Black} />

              <View style={styles.textWrapper}>
                <Text style={styles.cardHeader}>{game.name}</Text>
                <Text style={styles.cardDescription}>{game.description || "Ingen beskrivelse"}</Text>
                <Text style={styles.cardCategory}>{CATEGORY_LABELS[game.category]}</Text>
              </View>
            </View>
            <Pressable style={styles.saveIcon} onPress={() => handleSaveGame(game.id)}>
              <Feather name="bookmark" size={28} color={Color.Purple} />
            </Pressable>
          </TouchableOpacity>
        ))}

        <View style={styles.navButtons}>
          {hasPrev && (
            <Pressable style={styles.button} onPress={handlePrevPage}>
              <Text style={styles.buttonLabel}>Forrige</Text>
            </Pressable>
          )}
          {hasNext && (
            <Pressable style={styles.button} onPress={handleNextPage}>
              <Text style={styles.buttonLabel}>Neste</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.paragraph}>Side {pageNum}</Text>
      </VerticalScroll>

    </View>
  );
};

export default GameListScreen;
