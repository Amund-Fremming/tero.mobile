import * as AuthSession from "expo-auth-session";
import { useNavigation } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Auth0Config } from "../config/auth";
import Screen from "../constants/Screen";
import { BaseUser } from "../constants/Types";
import { err, ok, Result } from "../utils/result";
import { useModalProvider } from "./ModalProvider";
import { useServiceProvider } from "./ServiceProvider";

const REFRESH_TOKEN_KEY = "refresh_token";

interface IAuthContext {
  redirectUri: string;
  pseudoId: string;
  setPseudoId: React.Dispatch<React.SetStateAction<string>>;
  ensurePseudoId: () => Promise<Result<string>>;
  accessToken: string | null;
  callUpdateUserActivity: () => Promise<void>;
  triggerLogin: () => void;
  triggerLogout: (useBrowserConfirmation?: boolean) => Promise<boolean>;
  rotateTokens: () => Promise<void>;
  userData: BaseUser | null;
  setUserData: React.Dispatch<React.SetStateAction<BaseUser | null>>;

  logValues: () => void;
  resetPseudoId: () => void;
  invalidateAccessToken: () => void;
}

const defaultContextValue: IAuthContext = {
  redirectUri: "[NOT_SET]",
  pseudoId: "",
  setPseudoId: () => {},
  ensurePseudoId: async () => err("Pseudo id could not be created"),
  accessToken: null,
  callUpdateUserActivity: async () => {},
  triggerLogin: () => {},
  triggerLogout: async () => {
    return false;
  },
  rotateTokens: async () => {},
  userData: null,
  setUserData: () => {},

  logValues: () => {},
  resetPseudoId: () => {},
  invalidateAccessToken: () => {},
};

const AuthContext = createContext<IAuthContext>(defaultContextValue);

export const useAuthProvider = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [redirectUri, setRedirectUri] = useState<string>("[NOT_SET]");
  const [pseudoId, setPseudoId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<BaseUser | null>(null);
  const [forceLoginPrompt, setForceLoginPrompt] = useState<boolean>(false);

  const ensureInProgress = useRef<Promise<Result<string>> | null>(null);

  const navigation: any = useNavigation();
  const { displayErrorModal } = useModalProvider();
  const { userService, auditService } = useServiceProvider();
  const audit = auditService();

  useEffect(() => {
    if (pseudoId && pseudoId !== "") {
      SecureStore.setItemAsync("pseudo_id", pseudoId);
    }
  }, [pseudoId]);

  useEffect(() => {
    const initAuth = async () => {
      await rotateTokens();
      await ensurePseudoId();
    };

    initAuth();
    setRedirectUri(Auth0Config.redirectUri);
  }, []);

  const ensurePseudoId = async (): Promise<Result<string>> => {
    if (ensureInProgress.current) {
      return ensureInProgress.current;
    }

    const promise: Promise<Result<string>> = (async () => {
      const storedPseudoId = await SecureStore.getItemAsync("pseudo_id");

      const result = await userService().ensurePseudoId(storedPseudoId);
      if (result.isError()) {
        ensureInProgress.current = null;
        console.error(result.error);
        audit.critical(storedPseudoId ?? "unknown", null, "AuthProvider.ensurePseudoId", "Failed to ensure pseudo user", { storedPseudoId });
        return err("Failed to get pseudo id");
      }

      setPseudoId(result.value);
      await SecureStore.setItemAsync("pseudo_id", result.value);
      console.info("Pseudo user ensured with id: ", result.value);
      ensureInProgress.current = null;
      return ok(result.value);
    })();

    ensureInProgress.current = promise;
    return promise;
  };

  const callUpdateUserActivity = async () => {
    if (pseudoId === "") {
      console.error("No pseudo id!");
      navigation.navigate(Screen.Problem);
      return;
    }

    const result = await userService().patchUserActivity(pseudoId);
    if (result.isError()) {
      console.error(result.error);
    }
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: Auth0Config.clientId,
      scopes: ["openid", "profile", "name", "offline_access"],
      redirectUri: Auth0Config.redirectUri,
      responseType: "code",
      usePKCE: true,
      extraParams: {
        audience: Auth0Config.audience,
        pseudo_id: pseudoId || "unknown",
        ...(forceLoginPrompt && { prompt: "login" }),
      },
    },
    Auth0Config.discovery,
  );

  // Exchange code for tokens when response is successful
  useEffect(() => {
    const getTokens = async () => {
      if (response?.type === "success" && response.params.code) {
        try {
          const tokenResponse = await AuthSession.exchangeCodeAsync(
            {
              clientId: Auth0Config.clientId,
              code: response.params.code,
              redirectUri: Auth0Config.redirectUri,
              extraParams: {
                code_verifier: request?.codeVerifier || "",
              },
            },
            Auth0Config.discovery,
          );

          if (!tokenResponse.accessToken || !tokenResponse.refreshToken) {
            console.error("Klarte ikke hente tokens fra auth0");
            return;
          }

          const userResult = await userService().getUser(tokenResponse.accessToken);
          if (userResult.isError()) {
            console.warn("Auth0 login succeeded but user not found in backend");
            audit.critical(pseudoId || "unknown", tokenResponse.accessToken, "AuthProvider.getTokens", "Auth0 login succeeded but user not found in backend - possible sync issue");
            setAccessToken(null);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            setForceLoginPrompt(true);
            displayErrorModal("Bruker ikke funnet. Kontakt support eller prøv en annen konto.");
            return;
          }
          setForceLoginPrompt(false);

          setAccessToken(tokenResponse.accessToken);
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
          console.info("User logged inn successfully");
        } catch (error) {
          console.error("Token exchange failed:", error);
          audit.critical(pseudoId || "unknown", null, "AuthProvider.getTokens", "Token exchange failed", { error: String(error) });
          displayErrorModal("Innlogging feilet.");
        }
      } else if (response?.type === "error") {
        console.error(response.error);
        displayErrorModal("Innlogging feilet.");
        return;
      }
    };

    getTokens();
  }, [response]);

  const triggerLogin = () => {
    if (accessToken) {
      console.info("User is already logged in, skipping..");
      return;
    }

    if (!request) {
      displayErrorModal("Prøv igjen om litt.");
      return;
    }

    promptAsync().catch((e) => {
      console.error(e);
      displayErrorModal("Innlogging feilet.");
    });
  };

  const triggerLogout = async (useBrowserConfirmation: boolean = true): Promise<boolean> => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("id_token");
        setAccessToken(null);
        return true;
      }

      if (useBrowserConfirmation) {
        const returnTo = Auth0Config.redirectUri;
        const params = new URLSearchParams({
          client_id: Auth0Config.clientId,
          returnTo: returnTo,
        });

        const logoutUrl = `https://${Auth0Config.domain}/v2/logout?${params.toString()}`;
        const response = await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
        if (response.type === "cancel" || response.type === "dismiss") {
          console.warn("Logout was cancelled by user");
          return false;
        }
      }

      const revokeConfig = {
        token: refreshToken,
        clientId: Auth0Config.clientId,
      };
      const revokeDiscovery = {
        revocationEndpoint: `https://${Auth0Config.domain}/oauth/revoke`,
      };
      await AuthSession.revokeAsync(revokeConfig, revokeDiscovery);

      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("id_token");
      setAccessToken(null);

      console.info("User has been successfully logged out.");

      return true;
    } catch (e) {
      triggerLogout(false);
      console.error("Error during logout:", e);
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("id_token");
      setAccessToken(null);
      return true;
    }
  };

  const rotateTokens = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        setAccessToken(null);
        return;
      }

      const refreshResponse = await fetch(`https://${Auth0Config.domain}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: Auth0Config.clientId,
          refresh_token: refreshToken,
        }).toString(),
      });

      const tokens = await refreshResponse.json();

      if (!refreshResponse.ok) {
        console.warn("Refresh token response was an error, logging user out");
        audit.warning(pseudoId || "unknown", null, "AuthProvider.rotateTokens", "Refresh token rejected by Auth0 - forced logout", { status: refreshResponse.status });
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("id_token");
        setAccessToken(null);
        return;
      }

      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh_token);
      setAccessToken(tokens.access_token);
      console.debug("Tokens refreshed successfully");
    } catch (error) {
      audit.critical(pseudoId || "unknown", null, "AuthProvider.rotateTokens", "Token rotation crashed", { error: String(error) });
      displayErrorModal("Uventet feil. Logger ut.");
      setAccessToken(null);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      console.error(error);
    }
  };

  const logValues = () => {
    console.debug("Access token:", accessToken);
    console.debug("Refresh token:", SecureStore.getItem(REFRESH_TOKEN_KEY));
    console.debug("Pseudo id:", pseudoId);
  };

  const resetPseudoId = async () => {
    setPseudoId("");
    await SecureStore.deleteItemAsync("pseudo_id");
  };

  const invalidateAccessToken = () => {
    setAccessToken(
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ",
    );
  };

  const value = {
    callUpdateUserActivity,
    pseudoId,
    setPseudoId,
    ensurePseudoId,
    accessToken,
    triggerLogin,
    triggerLogout,
    rotateTokens,
    redirectUri,
    userData,
    setUserData,

    logValues,
    resetPseudoId,
    invalidateAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
