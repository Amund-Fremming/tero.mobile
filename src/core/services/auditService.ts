import axios from "axios";
import { LogCeverity } from "../constants/Types";
import { getHeaders } from "../utils/utilFunctions";

export interface ClientLogRequest {
  ceverity: LogCeverity;
  function: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  private urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async log(pseudoId: string, token: string | null, request: ClientLogRequest): Promise<void> {
    try {
      await axios.post(`${this.urlBase}/logs/client`, request, {
        headers: getHeaders(pseudoId, token),
      });
    } catch (error) {
      console.error("AuditService.log:", error);
    }
  }

  critical(pseudoId: string, token: string | null, fn: string, description: string, metadata?: Record<string, unknown>): void {
    this.log(pseudoId, token, { ceverity: LogCeverity.Critical, function: fn, description, metadata });
  }

  warning(pseudoId: string, token: string | null, fn: string, description: string, metadata?: Record<string, unknown>): void {
    this.log(pseudoId, token, { ceverity: LogCeverity.Warning, function: fn, description, metadata });
  }

  info(pseudoId: string, token: string | null, fn: string, description: string, metadata?: Record<string, unknown>): void {
    this.log(pseudoId, token, { ceverity: LogCeverity.Info, function: fn, description, metadata });
  }
}
