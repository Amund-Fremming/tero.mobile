import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Auth0Config } from "../components/Auth0/config";
import * as AuthSession from "expo-auth-session";
import { useModalProvider } from "./ModalProvider";
import * as WebBrowser from "expo-web-browser";
import { useServiceProvider } from "./ServiceProvider";
import { useNavigation } from "expo-router";
import Screen from "../constants/Screen";
import { err, ok, Result } from "../utils/result";
import { BaseUser } from "../constants/Types";

const REFRESH_TOKEN_KEY = "refresh_token";

interface IAuthContext {
  redirectUri: string;
  pseudoId: string | null;
  setPseudoId: React.Dispatch<React.SetStateAction<string | null>>;
  accessToken: string | null;
  callUpdateUserActivity: () => Promise<void>;
  triggerLogin: () => void;
  triggerLogout: () => Promise<boolean>;
  rotateTokens: () => Promise<void>;
  userData: BaseUser | null;
  setUserData: React.Dispatch<React.SetStateAction<BaseUser | null>>;

  // TODO - remove
  logValues: () => void;
  resetPseudoId: () => void;
  invalidateAccessToken: () => void;
}

const defaultContextValue: IAuthContext = {
  redirectUri: "[NOT_SET]",
  pseudoId: null,
  setPseudoId: () => {},
  accessToken: null,
  callUpdateUserActivity: async () => {},
  triggerLogin: () => {},
  triggerLogout: async () => {
    return false;
  },
  rotateTokens: async () => {},
  userData: null,
  setUserData: () => {},

  // TODO - remove
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
  const [pseudoId, setPseudoId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<BaseUser | null>(null);

  const navigation: any = useNavigation();
  const { displayErrorModal } = useModalProvider();
  const { userService } = useServiceProvider();

  useEffect(() => {
    if (pseudoId && pseudoId !== "") {
      SecureStore.setItem("pseudo_id", pseudoId);
    }
  }, [pseudoId]);

  useEffect(() => {
    handleAuth();
    setRedirectUri(Auth0Config.redirectUri);
  }, []);

  const handleAuth = async (): Promise<Result<string>> => {
    const storedPseudoId = await SecureStore.getItemAsync("pseudo_id");
    await rotateTokens();

    if (storedPseudoId) {
      setPseudoId(storedPseudoId);
      return ok(storedPseudoId);
    }

    let result = await userService().ensurePseudoId(storedPseudoId);
    if (result.isError()) {
      console.error(result.error);
      return err("Failed to get pseudo id");
    }

    setPseudoId(result.value);
    await SecureStore.setItemAsync("pseudo_id", result.value);
    console.log("Pseudo user created with id: ", result.value);

    return ok(result.value);
  };

  const callUpdateUserActivity = async () => {
    if (!pseudoId) {
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
        pseudo_id: pseudoId ?? "unknown",
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

          setAccessToken(tokenResponse.accessToken);
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
          console.info("User logged inn successfully");
        } catch (error) {
          console.error("Token exchange failed:", error);
          displayErrorModal("Feil ved tokenutveksling");
        }
      } else if (response?.type === "error") {
        console.error(response.error);
        displayErrorModal("Det skjedde en feil ved login");
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
      displayErrorModal("Køen er full, vent litt med å forsøke igjen");
      return;
    }

    promptAsync().catch((e) => {
      console.error(e);
      displayErrorModal("Det skjedde en feil ved login");
    });
  };

  const triggerLogout = async (): Promise<boolean> => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        // TODO - HANDLE
        console.error("THIS SHOULD NEVER HAPPEN");
        return false;
      }

      const returnTo = Auth0Config.redirectUri;
      const params = new URLSearchParams({
        client_id: Auth0Config.clientId,
        returnTo: returnTo,
      });

      const logoutUrl = `https://${Auth0Config.domain}/v2/logout?${params.toString()}`;
      let response = await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      if (response.type === "cancel" || response.type === "dismiss") {
        console.warn("Logout was cancelled by user");
        return false;
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

      console.log("User has been successfully logged out.");

      return true;
    } catch (e) {
      // TODO - just cleanup as a "logout" do not show errors, maybe log to backend
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
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("id_token");
        setAccessToken(null);
        return;
      }

      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh_token);
      setAccessToken(tokens.access_token);
      console.log("Tokens refreshed successfully");
    } catch (error) {
      displayErrorModal("En uventet feil har skjedd, logger deg ut.");
      setAccessToken(null);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      console.error(error);
    }
  };

  // TODO - remove
  const logValues = () => {
    console.log("Access token:", accessToken);
    console.log("Refresh token:", SecureStore.getItem(REFRESH_TOKEN_KEY));
    console.log("Pseudo id:", pseudoId);
  };

  // TODO - remove
  const resetPseudoId = async () => {
    setPseudoId("");
    await SecureStore.deleteItemAsync("pseudo_id");
  };

  // TODO - remove
  const invalidateAccessToken = () => {
    setAccessToken(
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ",
    );
  };

  const value = {
    callUpdateUserActivity,
    pseudoId,
    setPseudoId,
    accessToken,
    triggerLogin,
    triggerLogout,
    rotateTokens,
    redirectUri,
    userData,
    setUserData,

    // TODO - remove
    logValues,
    resetPseudoId,
    invalidateAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
