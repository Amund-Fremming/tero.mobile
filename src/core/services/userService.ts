import { err, ok, Result } from "../utils/result";
import axios from "axios";

import {
  ActivityStats,
  BaseUser,
  ClientPopup,
  PatchUserRequest,
  ResetPasswordRequest,
  UserWithRole,
} from "../constants/Types";
import { getHeaders } from "../utils/utilFunctions";

export class UserService {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async resetPassword(token: string, pseudoId: string, email: string): Promise<Result> {
    try {
      const payload: ResetPasswordRequest = { email };
      const url = `${this.baseUrl}/users/reset-password/${pseudoId}`;

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.debug("Reset successful:", response.data);
      return ok();
    } catch (error) {
      return err(error + "");
    }
  }

  getProfilePicture(guest_id: string, username?: string): string {
    if (!username) {
      username = guest_id;
    }

    const avatar = `https://api.dicebear.com/9.x/pixel-art/png?seed=${username}`;
    console.log(avatar);
    return avatar;
  }

  async ensurePseudoId(pseudo_id: string | null): Promise<Result<string>> {
    try {
      const url = pseudo_id ? `${this.baseUrl}/pseudo-users?pseudo_id=${pseudo_id}` : `${this.baseUrl}/pseudo-users`;

      const response = await axios.post<string>(url);
      return ok(response.data);
    } catch (error) {
      console.error("ensurePseudoId:", error);
      return err("Klarte ikke å hente gjeste id");
    }
  }

  async getUser(token: string): Promise<Result<UserWithRole>> {
    try {
      const url = `${this.baseUrl}/users/me`;
      const response = await axios.get<UserWithRole>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return ok(response.data);
    } catch (error) {
      console.error("getUserData:", error);
      return err("Klarte ikke hente brukerdata");
    }
  }

  async patchUser(token: string, user_id: string, request: PatchUserRequest): Promise<Result<BaseUser>> {
    try {
      const url = `${this.baseUrl}/users/${user_id}`;
      const response = await axios.patch<BaseUser>(url, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return ok(response.data);
    } catch (error) {
      console.error("patchUser:", error);
      return err("Klarte ikke oppdatere bruker");
    }
  }

  async patchUserActivity(guest_id: string): Promise<Result<void>> {
    try {
      const url = `${this.baseUrl}/users/activity`;
      const response = axios.patch(url, {
        headers: getHeaders(guest_id, null),
      });
      if (((await response).status! = 200)) {
        // TODO AUDIT LOG
        console.error("Failed to update user activity");
      }

      return ok();
    } catch (error) {
      console.log("patchUserActivity:", error);
      return err("Klarte ikke oppdatere bruker aktivitet");
    }
  }

  async deleteUser(token: string, user_id: string): Promise<Result<void>> {
    try {
      const url = `${this.baseUrl}/users/delete?user_id=${user_id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status != 200) {
        return err("Klarte ikke slette bruker");
      }

      return ok();
    } catch (error) {
      console.log("deleteUser:", error);
      return err("Klarte ikke slette bruker");
    }
  }

  async listUsers(token: string): Promise<Result<BaseUser[]>> {
    try {
      const url = `${this.baseUrl}/users`;
      const response = await axios.get<BaseUser[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return ok(response.data);
    } catch (error) {
      console.log("listUsers:", error);
      return err("Klarte ikke liste ut brukere");
    }
  }

  async validateToken(token: string): Promise<Result<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/valid-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return ok(true);
      }

      if (response.status === 401 || response.status === 403) {
        return ok(false);
      }

      return err("Invalid token");
    } catch (error) {
      console.log("validateToken:", error);
      return err("Klarte ikke validere token");
    }
  }

  async getGlobalPopup(): Promise<Result<ClientPopup>> {
    try {
      const url = `${this.baseUrl}/pseudo-users/popups`;
      const response = await axios.get<ClientPopup>(url);
      return ok(response.data);
    } catch (error) {
      console.error("getGlobalPopup:", error);
      return err("Failed to get client popup");
    }
  }

  async updateGlobalPopup(token: string, popup: ClientPopup): Promise<Result<ClientPopup>> {
    try {
      const response = await axios.put<ClientPopup>(`${this.baseUrl}/users/popups`, popup, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return ok(response.data);
    } catch (error) {
      console.log("updateGlobalPopup:", error);
      return err("Klarte ikke oppdatere popup");
    }
  }

  async getUserStats(token: string): Promise<Result<ActivityStats>> {
    try {
      const url = `${this.baseUrl}/users/activity-stats`;
      const response = await axios.get<ActivityStats>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        return err("Response was not 200");
      }

      return ok(response.data);
    } catch (error) {
      console.error("getUserStats:", error);
      return err("Failed to get user stats");
    }
  }

  async changePassword(token: string, oldPassword: string, newPassword: string): Promise<Result<void>> {
    try {
      const url = `${this.baseUrl}/users/password`;
      const response = await axios.patch(
        url,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status !== 200) {
        return err("Klarte ikke endre passord");
      }

      return ok();
    } catch (error) {
      console.error("changePassword:", error);
      return err("Klarte ikke endre passord");
    }
  }
}
