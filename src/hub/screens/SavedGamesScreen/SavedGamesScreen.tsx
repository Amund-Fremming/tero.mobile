import { GenericGameList } from "@/src/core/components/GenericGameList/GenericGameList";
import { GameBase, GameType, PagedResponse } from "@/src/core/constants/Types";
import { useAppDataProvider } from "@/src/core/context/AppDataProvider";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useSavedGamesProvider } from "@/src/core/context/SavedGamesProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useThemeProvider } from "@/src/core/context/ThemeProvider";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";

const GAME_TYPES = Object.values(GameType).filter((g) => g !== GameType.Dice && g !== GameType.Defuser);

export const SavedGamesScreen = () => {
  const { gameService } = useServiceProvider();
  const { accessToken } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const { refreshIds, unsaveGame } = useSavedGamesProvider();
  const { prefetchedSavedGamesPage } = useAppDataProvider();
  const { theme } = useThemeProvider();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      await unsaveGame(game.id);
      setRefreshTrigger((t) => t + 1);
    },
    [accessToken, unsaveGame],
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
      headerBackgroundColor={theme.primary}
      emptyMessage="Du har ingen lagrede spill"
      gameTypes={GAME_TYPES}
      fetchPage={fetchPage}
      renderCardAction={renderCardAction}
      showSkeleton={false}
      initialPage={prefetchedSavedGamesPage ?? undefined}
      refreshOnFocus={handleRefreshOnFocus}
      refreshTrigger={refreshTrigger}
    />
  );
};
