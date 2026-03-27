import axios from "axios";
import { SessionCacheInfo } from "../constants/Types";
import { err, ok, Result } from "../utils/result";

export class AdminService {
  urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async getSessionCacheInfo(token: string): Promise<Result<SessionCacheInfo>> {
    try {
      const url = `${this.urlBase}/session`;
      const response = await axios.get<SessionCacheInfo>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return ok(response.data);
    } catch (error) {
      console.error("getSessionCacheInfo:", error);
      return err("Failed to get session cache info");
    }
  }
}
