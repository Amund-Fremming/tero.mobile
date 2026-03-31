import axios from "axios";
import {
  CreateGameTipRequest,
  CreateStaticGameRequest,
  GameBase,
  GamePagedRequest,
  GameType,
  InteractiveGameResponse,
  JoinGameResponse,
  LogAction,
  LogCeverity,
  PagedResponse,
  SubjectType,
} from "../../core/constants/Types";
import { err, ok, Result } from "../../core/utils/result";
import { getHeaders } from "../../core/utils/utilFunctions";
import { AuditLogService } from "../../core/services/auditLogService";

export class GameService {
  urlBase: string;
  private auditLog: AuditLogService;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
    this.auditLog = new AuditLogService(urlBase);
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

  async createSession(pseudoId: string, type: GameType): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post<InteractiveGameResponse>(
        `${this.urlBase}/games/session/${type}/create`,
        {},
        {
          headers: getHeaders(pseudoId, null),
        },
      );

      const result: InteractiveGameResponse = response.data;
      return ok(result);
    } catch (error) {
      console.error("createSession:", error);
      return err("Klarte ikke opprette spill");
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
      await this.auditLog.postLog(getHeaders(guest_id, token), {
        subject_id: guest_id,
        subject_type: token ? SubjectType.RegisteredUser : SubjectType.GuestUser,
        action: LogAction.Update,
        ceverity: LogCeverity.Warning,
        file_name: "gameService.ts",
        description: "Failed to free game key",
        metadata: `game_type: ${game_type}, key_word: ${key_word}`,
      });
      return ok(undefined);
    }
  }

  async persistStaticGame(
    pseudoId: string,
    gameType: GameType,
    request: CreateStaticGameRequest,
  ): Promise<Result<void>> {
    try {
      await axios.post(`${this.urlBase}/games/static/persist/${gameType}`, request, {
        headers: getHeaders(pseudoId, null),
      });

      return ok(undefined);
    } catch (error) {
      console.error("persistStaticGame:", error);
      return err("Klarte ikke lagre spill");
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

  async initiateRandomStaticGame<T>(game_type: string, pseudo_id: string): Promise<Result<T>> {
    try {
      const response = await axios.get(`${this.urlBase}/games/static/${game_type}/initiate-random`, {
        headers: getHeaders(pseudo_id, null),
      });
      const data: T = response.data;
      return ok(data);
    } catch (error) {
      console.error("initiateRandomStaticGame", error);
      return err("Failed to initiate random static game");
    }
  }

  async initiateRandomInteractiveGame(game_type: string, pseudo_id: string): Promise<Result<InteractiveGameResponse>> {
    try {
      const response = await axios.post(
        `${this.urlBase}/games/session/${game_type}/initiate-random`,
        {},
        {
          headers: getHeaders(pseudo_id, null),
        },
      );
      const data: InteractiveGameResponse = response.data;
      return ok(data);
    } catch (error) {
      console.error("initiateRandomGame", error);
      return err("Failed to initiate random game");
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
