import axios from "axios";
import { GameTip, LogCategoryCount, LogCeverity, PagedResponse, SystemHealth, SystemLog } from "../constants/Types";
import { err, ok, Result } from "../utils/result";

export class CommonService {
  urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async health(): Promise<Result<string>> {
    try {
      const url = `${this.urlBase}/health`;
      const response = await axios.get(url);
      if (response.data !== "OK") {
        console.error("Server is down");
        return err("Server er nede, prøv igjen senere");
      }
      return ok(response.data);
    } catch (error) {
      console.error("health:", error);
      return err("health check failed");
    }
  }

  async healthDetailed(): Promise<Result<SystemHealth>> {
    try {
      const url = `${this.urlBase}/health/detailed`;
      const response = await axios.get(url);
      return ok(response.data);
    } catch (error) {
      return err("health detailed check failed");
    }
  }

  /* Move to admin service? */

  async getLogCounts(token: string): Promise<Result<LogCategoryCount>> {
    try {
      const url = `${this.urlBase}/logs/count`;
      const response = await axios.get<LogCategoryCount>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return ok(response.data);
    } catch (error) {
      console.error("getLogCounts:", error);
      return err("Failed to get error log counts");
    }
  }

  async getLogs(
    token: string,
    ceverity: LogCeverity | null,
    pageNum: number,
  ): Promise<Result<PagedResponse<SystemLog>>> {
    try {
      const categoryParam = ceverity ? `&ceverity=${ceverity}` : "";
      const url = `${this.urlBase}/logs?page_num=${pageNum}${categoryParam}`;
      const response = await axios.get<PagedResponse<SystemLog>>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return ok(response.data);
    } catch (error) {
      console.error("getLogs:", error);
      return err("Failed to get logs");
    }
  }

  getRandomUserIcons(count: number = 40): string[] {
    return Array.from(
      { length: count },
      () => `https://api.dicebear.com/9.x/pixel-art/png?seed=${Math.random().toString(36).slice(2)}`,
    );
  }

  async getGameTips(token: string, pageNum: number = 0): Promise<Result<PagedResponse<GameTip>>> {
    try {
      const url = `${this.urlBase}/tips/admin?page_num=${pageNum}`;

      const response = await axios.get<PagedResponse<GameTip>>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return ok(response.data);
    } catch (error) {
      return err(error + "");
    }
  }
}
