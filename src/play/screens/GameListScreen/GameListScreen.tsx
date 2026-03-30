import { GenericGameList } from "@/src/core/components/GenericGameList/GenericGameList";
import Color from "@/src/core/constants/Color";
import Screen from "@/src/core/constants/Screen";
import { GameBase, GamePagedRequest, GameType, PagedResponse } from "@/src/core/constants/Types";
import { useAppDataProvider } from "@/src/core/context/AppDataProvider";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useSavedGamesProvider } from "@/src/core/context/SavedGamesProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useToastProvider } from "@/src/core/context/ToastProvider";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";

const GAME_TYPES = Object.values(GameType).filter((g) => g !== GameType.Dice);

export const GameListScreen = () => {
  const navigation: any = useNavigation();
  const { gameService } = useServiceProvider();
  const { pseudoId, accessToken, triggerLogin } = useAuthProvider();
  const { displayActionModal } = useModalProvider();
  const { displayToast } = useToastProvider();
  const { savedIdSet, saveGame: saveGameToSet } = useSavedGamesProvider();
  const { prefetchedGamePage } = useAppDataProvider();

  const fetchPage = useCallback(
    async (pageNum: number, gameType: GameType | null): Promise<PagedResponse<GameBase> | null> => {
      const request: GamePagedRequest = { page_num: pageNum, game_type: gameType, category: null };
      const result = await gameService().getGamePage<GameBase>(pseudoId, request);
      if (result.isError()) return null;
      return result.value;
    },
    [pseudoId],
  );

  const handleSaveGame = useCallback(
    async (gameId: string) => {
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
    },
    [accessToken, savedIdSet],
  );

  const renderCardAction = useCallback(
    (game: GameBase) => ({
      saved: savedIdSet.has(game.id),
      onActionPress: () => handleSaveGame(game.id),
    }),
    [savedIdSet, handleSaveGame],
  );

  return (
    <GenericGameList
      title="Velg spill"
      headerBackgroundColor={Color.BuzzifyLavender}
      emptyMessage="Det finnes ingen spill av denne typen enda"
      gameTypes={GAME_TYPES}
      fetchPage={fetchPage}
      renderCardAction={renderCardAction}
      showSkeleton
      initialPage={prefetchedGamePage ?? undefined}
      onInfoPress={() => console.log("Info pressed")}
    />
  );
};

export default GameListScreen;
