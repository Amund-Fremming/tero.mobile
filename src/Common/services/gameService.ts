import axios from "axios";
import { err, ok, Result } from "../utils/result";
import { getHeaders } from "./utils";
import {
  CreateGameRequest,
  CreateGameTipRequest,
  GameBase,
  GamePagedRequest,
  GameType,
  InteractiveGameResponse,
  JoinGameResponse,
  PagedResponse,
} from "../constants/Types";

export class GameService {
  urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async createGameTip(request: CreateGameTipRequest): Promise<Result> {
    try {
      const response = await axios.post<InteractiveGameResponse>(`${this.urlBase}/tips`, request);

      return ok();
    } catch (error) {
      console.error("createInteractiveGame:", error);
      return err("Klarte ikke opprette spill");
    }
  }

  async createInteractiveGame(
    pseudoId: string,
    type: GameType,
    request: CreateGameRequest,
  ): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post<InteractiveGameResponse>(
        `${this.urlBase}/games/session/${type}/create`,
        request,
        {
          headers: getHeaders(pseudoId, null),
        },
      );

      const result: InteractiveGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("createInteractiveGame:", error);
      return err("Klarte ikke opprette spill");
    }
  }

  async deleteGame(guest_id: string, token: string | null, game_id: string): Promise<Result<void>> {
    try {
      await axios.delete(`${this.urlBase}/games/${game_id}`, {
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
    key_word: string,
  ): Promise<Result<void>> {
    try {
      await axios.patch(
        `${this.urlBase}/keys/${game_type}/free/${key_word}`,
        {},
        {
          headers: getHeaders(guest_id, token),
        },
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
        },
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

  async getSavedGames(
    token: string,
    page_num: number,
    game_type?: GameType | null,
  ): Promise<Result<PagedResponse<GameBase>>> {
    try {
      const params: Record<string, string | number> = {};
      params.page_num = page_num;
      if (game_type != null) {
        params.game_type = game_type;
      }

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      console.debug("URL: ", `${this.urlBase}/games/general/saved?${queryString}`);
      const response = await axios.get(`${this.urlBase}/games/general/saved?${queryString}`, {
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

  async getGamePage<T>(guest_id: string, request: GamePagedRequest): Promise<Result<PagedResponse<T>>> {
    try {
      const params: Record<string, string | number> = {};
      if (request.page_num != null) params.page_num = request.page_num;
      if (request.game_type != null) params.game_type = request.game_type;
      if (request.category != null) params.category = request.category;

      const response = await axios.get(`${this.urlBase}/games/general/page`, {
        params,
        headers: getHeaders(guest_id, null),
      });

      const page: PagedResponse<T> = response.data;
      return ok(page);
    } catch (error) {
      console.error("getGamePage:", error);
      return err("Klarte ikke hente spill");
    }
  }

  async initiateStaticGame<T>(game_type: string, game_id: string, pseudo_id: string): Promise<Result<T>> {
    try {
      const response = await axios.get(`${this.urlBase}/games/static/${game_type}/initiate/${game_id}`, {
        headers: getHeaders(pseudo_id, null),
      });
      const data: T = response.data;
      return ok(data);
    } catch (error) {
      console.error("initiateStandaloneGame", error);
      return err("Failed to initiate standalone game");
    }
  }

  // Remove?
  async initiateSessionGame(
    pseudo_id: string,
    game_type: string,
    game_id: string,
  ): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post(
        `${this.urlBase}/games/session/${game_type}/initiate/${game_id}`,
        {},
        {
          headers: getHeaders(pseudo_id, null),
        },
      );

      const result: InteractiveGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("initiateInteractiveGame:", error);
      return err("Klarte ikke starte spill");
    }
  }

  async joinInteractiveGame(pseudo_id: string, game_key: string): Promise<Result<JoinGameResponse>> {
    try {
      const response = await axios.post<JoinGameResponse>(
        `${this.urlBase}/games/session/join/${game_key}`,
        {},
        {
          headers: getHeaders(pseudo_id, null),
          validateStatus: () => true, // Don't throw on any status code
        },
      );

      if (response.status === 404) {
        return err("Game not found");
      }

      if (response.status >= 400) {
        return err("Failed to join game");
      }

      const result: JoinGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("joinInteractiveGame:", error);
      return err("Failed to join game");
    }
  }
}
