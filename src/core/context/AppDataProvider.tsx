import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GameBase, GamePagedRequest, PagedResponse } from "../constants/Types";
import { useAuthProvider } from "./AuthProvider";
import { useServiceProvider } from "./ServiceProvider";

interface IAppDataContext {
  prefetchedGamePage: PagedResponse<GameBase> | null;
  prefetchedSavedGamesPage: PagedResponse<GameBase> | null;
}

const AppDataContext = createContext<IAppDataContext>({
  prefetchedGamePage: null,
  prefetchedSavedGamesPage: null,
});

export const useAppDataProvider = () => useContext(AppDataContext);

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider = ({ children }: AppDataProviderProps) => {
  const [prefetchedGamePage, setPrefetchedGamePage] = useState<PagedResponse<GameBase> | null>(null);
  const [prefetchedSavedGamesPage, setPrefetchedSavedGamesPage] = useState<PagedResponse<GameBase> | null>(null);

  const { pseudoId, accessToken } = useAuthProvider();
  const { gameService } = useServiceProvider();

  useEffect(() => {
    if (!pseudoId) return;
    const request: GamePagedRequest = { page_num: 0, game_type: null, category: null };
    gameService()
      .getGamePage<GameBase>(pseudoId, request)
      .then((result) => {
        if (!result.isError()) setPrefetchedGamePage(result.value);
      });
  }, [pseudoId]);

  useEffect(() => {
    if (!accessToken) return;
    gameService()
      .getSavedGames(accessToken, 0, null)
      .then((result) => {
        if (!result.isError()) setPrefetchedSavedGamesPage(result.value);
      });
  }, [accessToken]);

  return (
    <AppDataContext.Provider value={{ prefetchedGamePage, prefetchedSavedGamesPage }}>
      {children}
    </AppDataContext.Provider>
  );
};

export default AppDataProvider;
