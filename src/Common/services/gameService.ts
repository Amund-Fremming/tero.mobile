import axios from "axios";
import { err, ok, Result } from "../utils/result";
import { getHeaders } from "./utils";
import {
  CreateGameRequest,
  GameBase,
  GamePageQuery,
  GameType,
  InteractiveGameResponse,
  PagedResponse,
} from "../constants/Types";

export class GameService {
  urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async createInteractiveGame(
    pseudoId: string,
    type: GameType,
    request: CreateGameRequest
  ): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post<InteractiveGameResponse>(
        `${this.urlBase}/games/general/${type}/create`,
        request,
        {
          headers: getHeaders(pseudoId, null),
        }
      );

      let result: InteractiveGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("createInteractiveGame:", error);
      return err("Klarte ikke opprette spill");
    }
  }

  async deleteGame(guest_id: string, token: string | null, game_type: string, game_id: string): Promise<Result<void>> {
    try {
      await axios.delete(`${this.urlBase}/games/${game_type}/${game_id}`, {
        headers: getHeaders(guest_id, token),
      });
      return ok(undefined);
    } catch (error) {
      console.error("deleteGame:", error);
      return err("Klarte ikke slette spill");
    }
  }

  async freeGameKey(
    guest_id: string,
    token: string | null,
    game_type: string,
    key_word: string
  ): Promise<Result<void>> {
    try {
      await axios.patch(
        `${this.urlBase}/keys/${game_type}/free/${key_word}`,
        {},
        {
          headers: getHeaders(guest_id, token),
        }
      );

      return ok(undefined);
    } catch (error) {
      console.error("freeGameKey:", error);
      // TODO - AUDIT LOG?!?!
      return ok(undefined);
    }
  }

  async saveGame(token: string, game_id: string): Promise<Result<void>> {
    try {
      await axios.post(
        `${this.urlBase}/games/general/save/${game_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return ok(undefined);
    } catch (error) {
      console.error("saveGame:", error);
      return err("Klarte ikke lagre spill");
    }
  }

  async unsaveGame(token: string, game_id: string): Promise<Result<void>> {
    try {
      await axios.delete(`${this.urlBase}/games/general/unsave/${game_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return ok(undefined);
    } catch (error) {
      console.error("unsaveGame:", error);
      return err("Klarte ikke fjerne lagret spill");
    }
  }

  async getSavedGames(token: string, page_num: number): Promise<Result<PagedResponse<GameBase>>> {
    try {
      const response = await axios.get(`${this.urlBase}/games/general/saved?page_num=${page_num}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return ok(response.data);
    } catch (error) {
      console.error("getSavedGames:", error);
      return err("Klarte ikke hente lagrede spill");
    }
  }

  async getGamePage<T>(guest_id: string, request: GamePageQuery): Promise<Result<PagedResponse<T>>> {
    try {
      const response = await axios.post(`${this.urlBase}/games/general/page`, request, {
        headers: getHeaders(guest_id, null),
      });

      const page: PagedResponse<T> = response.data;
      return ok(page);
    } catch (error) {
      console.error("getGamePage:", error);
      return err("Klarte ikke hente spill");
    }
  }

  /*
    async initiateStandaloneGame(game_type: string, game_id: string, guest_id: string, token: string | null): Promise<Result<StandaloneGameResponse>> {
        try {
            const response = await axios.get(`/games/standalone/${game_type}/initiate/${game_id}`, {
                headers: getHeaders(guest_id, token)
            });
            return ok(response.data);
        } catch (error) {
            console.error("", error);
            return err("Failed to initiate standalone game");
        }
    }
        */

  async initiateInteractiveGame(
    guest_id: string,
    token: string | null,
    game_type: string,
    game_id: string
  ): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post(
        `${this.urlBase}/games/interactive/${game_type}/initiate/${game_id}`,
        {},
        {
          headers: getHeaders(guest_id, token),
        }
      );

      const result: InteractiveGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("initiateInteractiveGame:", error);
      return err("Klarte ikke starte spill");
    }
  }

  async joinInteractiveGame(
    guest_id: string,
    token: string | null,
    game_type: string,
    game_id: string
  ): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post(
        `${this.urlBase}/games/interactive/${game_type}/join/${game_id}`,
        {},
        {
          headers: getHeaders(guest_id, token),
        }
      );

      const result: InteractiveGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("joinInteractiveGame:", error);
      return err("Klarte ikke bli med i spill");
    }
  }
}
