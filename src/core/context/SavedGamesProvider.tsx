import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./AuthProvider";
import { useModalProvider } from "./ModalProvider";
import { useServiceProvider } from "./ServiceProvider";

interface ISavedGamesContext {
  savedIdSet: Set<string>;
  saveGame: (id: string) => Promise<void>;
  unsaveGame: (id: string) => Promise<void>;
  refreshIds: () => Promise<void>;
}

const defaultContextValue: ISavedGamesContext = {
  savedIdSet: new Set(),
  saveGame: async () => {},
  unsaveGame: async () => {},
  refreshIds: async () => {},
};

const SavedGamesContext = createContext<ISavedGamesContext>(defaultContextValue);

export const useSavedGamesProvider = () => useContext(SavedGamesContext);

interface SavedGamesProviderProps {
  children: ReactNode;
}

export const SavedGamesProvider = ({ children }: SavedGamesProviderProps) => {
  const [savedIdSet, setSavedIdSet] = useState<Set<string>>(new Set());
  const { accessToken } = useAuthProvider();
  const { gameService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();

  const refreshIds = async () => {
    if (!accessToken) return;

    const allIds = new Set<string>();
    let page = 0;
    let hasNext = true;

    while (hasNext) {
      const result = await gameService().getSavedGames(accessToken, page);
      if (result.isError()) break;
      result.value.items.forEach((g) => allIds.add(g.id));
      hasNext = result.value.has_next;
      page++;
    }

    setSavedIdSet(allIds);
  };

  useEffect(() => {
    if (accessToken) {
      refreshIds();
    }
  }, [accessToken]);

  const saveGame = async (id: string) => {
    if (!accessToken || savedIdSet.has(id)) return;

    setSavedIdSet((prev) => new Set([...prev, id]));
    const result = await gameService().saveGame(accessToken, id);
    if (result.isError()) {
      setSavedIdSet((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      displayErrorModal("Noe gikk galt. Prøv igjen.");
    }
  };

  const unsaveGame = async (id: string) => {
    if (!accessToken) return;

    setSavedIdSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    const result = await gameService().unsaveGame(accessToken, id);
    if (result.isError()) {
      setSavedIdSet((prev) => new Set([...prev, id]));
      displayErrorModal("Noe gikk galt. Prøv igjen.");
    }
  };

  return (
    <SavedGamesContext.Provider value={{ savedIdSet, saveGame, unsaveGame, refreshIds }}>
      {children}
    </SavedGamesContext.Provider>
  );
};

export default SavedGamesProvider;
