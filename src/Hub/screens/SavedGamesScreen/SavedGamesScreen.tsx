import { GenericGameList } from "@/src/core/components/GenericGameList/GenericGameList";
import Color from "@/src/core/constants/Color";
import { GameBase, GameType, PagedResponse } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useSavedGamesProvider } from "@/src/core/context/SavedGamesProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";

const GAME_TYPES = Object.values(GameType).filter((g) => g !== GameType.Dice);

export const SavedGamesScreen = () => {
  const { gameService } = useServiceProvider();
  const { accessToken, pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const { refreshIds } = useSavedGamesProvider();

  const fetchPage = useCallback(
    async (pageNum: number, gameType: GameType | null): Promise<PagedResponse<GameBase> | null> => {
      if (!accessToken) return null;
      const result = await gameService().getSavedGames(accessToken, pageNum, gameType);
      if (result.isError()) {
        displayErrorModal(result.error);
        return null;
      }
      return result.value;
    },
    [accessToken],
  );

  const handleUnsavePressed = useCallback(
    async (game: GameBase) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!accessToken) return;
      await gameService().unsaveGame(accessToken, game.id);
    },
    [accessToken],
  );

  const renderCardAction = useCallback(
    (game: GameBase) => ({
      deletable: true,
      onActionPress: () => handleUnsavePressed(game),
    }),
    [handleUnsavePressed],
  );

  const handleRefreshOnFocus = useCallback(() => {
    refreshIds();
  }, [refreshIds]);

  return (
    <GenericGameList
      title="Dine spill"
      headerBackgroundColor={Color.White}
      emptyMessage="Du har ingen lagrede spill"
      gameTypes={GAME_TYPES}
      fetchPage={fetchPage}
      renderCardAction={renderCardAction}
      showSkeleton={false}
      refreshOnFocus={handleRefreshOnFocus}
    />
  );
};
