import axios from "axios";
import { CreateSystemLogRequest } from "../constants/Types";
import { err, ok, Result } from "../utils/result";

export class AuditLogService {
  urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async postLog(headers: Record<string, string>, request: CreateSystemLogRequest): Promise<Result<void>> {
    try {
      await axios.post(`${this.urlBase}/logs`, request, { headers });
      return ok(undefined);
    } catch (error) {
      console.error("auditLog:", error);
      return err("Failed to create audit log");
    }
  }
}
