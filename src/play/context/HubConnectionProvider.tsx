import * as signalR from "@microsoft/signalr";
import React, { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { HUB_URL_BASE } from "../../core/config/api";
import { useAuthProvider } from "../../core/context/AuthProvider";
import { useModalProvider } from "../../core/context/ModalProvider";
import { registerCrashResetCallback, resetToHomeGlobal } from "../../core/utils/navigationRef";
import { err, ok, Result } from "../../core/utils/result";
import { useGlobalSessionProvider } from "./GlobalSessionProvider";

interface IHubConnectionContext {
  connect: (hubName: string) => Promise<Result<signalR.HubConnection>>;
  disconnect: () => Promise<Result>;
  debugDisconnect: () => Promise<void>;
  setListener: <T>(channel: string, fn: (item: T) => void) => Result;
  invokeFunction: (functionName: string, ...params: any[]) => Promise<Result<any>>;
}

const defaultContextValue: IHubConnectionContext = {
  connect: async (_hubName: string) => err(""),
  disconnect: async () => err(""),
  debugDisconnect: async () => {},
  setListener: (_channel: string, _fn: (item: any) => void) => err(""),
  invokeFunction: async (_functionName: string, ..._params: any[]) => err(""),
};

const HubConnectionContext = createContext<IHubConnectionContext>(defaultContextValue);

export const useHubConnectionProvider = () => useContext(HubConnectionContext);

interface HubConnectionProviderProps {
  children: ReactNode;
}

export const HubConnectionProvider = ({ children }: HubConnectionProviderProps) => {
  const connectionRef = useRef<signalR.HubConnection | undefined>(undefined);
  const disconnectTriggeredRef = useRef<boolean>(false);
  const debugDisconnectInProgressRef = useRef<boolean>(false);
  const hubNameRef = useRef<string | undefined>(undefined);
  const listenersMapRef = useRef<Map<string, (item: any) => void>>(new Map());
  const gameKeyRef = useRef<string>("");

  const { sessionData: sessionData, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { displayLoadingModal, closeLoadingModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();

  useEffect(() => {
    gameKeyRef.current = sessionData.gameKey;
  }, [sessionData.gameKey]);

  useEffect(() => {
    return registerCrashResetCallback(clearValues);
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (nextState) => {
      if (nextState !== "active" || !connectionRef.current || disconnectTriggeredRef.current) {
        return;
      }

      const state = connectionRef.current.state;
      if (state !== signalR.HubConnectionState.Disconnected) return;

      console.info("App foregrounded with dead connection — attempting reconnect");
      displayLoadingModal(() => giveUpAndGoHome());

      try {
        await connectionRef.current.start();
        reattachListeners();
        const result = await invokeFunction("ConnectToGroup", gameKeyRef.current, pseudoId);
        if (result.isError()) throw new Error(result.error);
        closeLoadingModal();
        console.info("Reconnected after app foregrounded");
      } catch (error) {
        console.error("Reconnect after foreground failed", error);
        giveUpAndGoHome();
      }
    });

    return () => sub.remove();
  }, []);

  const giveUpAndGoHome = () => {
    clearValues();
    clearGlobalSessionValues();
    closeLoadingModal();
    resetToHomeGlobal();
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const attemptReconnectAfterDebugDisconnect = async () => {
    if (!connectionRef.current) {
      debugDisconnectInProgressRef.current = false;
      return;
    }

    displayLoadingModal(() => giveUpAndGoHome());

    const retryDelaysMs = [0, 1000, 2500];
    for (const delayMs of retryDelaysMs) {
      try {
        if (delayMs > 0) {
          await wait(delayMs);
        }

        if (connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
          await connectionRef.current.start();
        }

        reattachListeners();

        const invokeResult = await invokeFunction("ConnectToGroup", gameKeyRef.current, pseudoId);
        if (invokeResult.isError()) {
          throw new Error(invokeResult.error);
        }

        debugDisconnectInProgressRef.current = false;
        closeLoadingModal();
        console.info("DEBUG: Manual reconnect succeeded after forced disconnect");
        return;
      } catch (error) {
        console.warn("DEBUG: Manual reconnect attempt failed", error);
      }
    }

    debugDisconnectInProgressRef.current = false;
    console.error("DEBUG: Manual reconnect failed after forced disconnect");
    giveUpAndGoHome();
  };

  async function connect(hubName: string): Promise<Result<signalR.HubConnection>> {
    try {
      const normalizedHubName = hubName === "roulette" || hubName === "duel" ? "spin" : hubName;
      hubNameRef.current = normalizedHubName;
      const hubAddress = `${HUB_URL_BASE}/${normalizedHubName}`;

      if (connectionRef.current) {
        const curHubName = (connectionRef.current as any)._hubName;

        if (curHubName !== normalizedHubName) {
          console.warn(`Switching hub from ${curHubName} to ${normalizedHubName}, closing old connection`);
          try {
            await connectionRef.current.stop();
          } catch (e) {
            console.warn("Error stopping old connection:", e);
          }
          connectionRef.current = undefined;
        } else {
          return ok(connectionRef.current);
        }
      }

      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubAddress)
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      (hubConnection as any)._hubName = normalizedHubName;

      hubConnection.onreconnecting(() => {
        if (disconnectTriggeredRef.current) return;
        console.warn("Connection lost, SignalR reconnecting...");
        displayLoadingModal(() => giveUpAndGoHome());
      });

      hubConnection.onreconnected(async () => {
        debugDisconnectInProgressRef.current = false;
        console.info("SignalR reconnected successfully");
        reattachListeners();

        const invokeResult = await invokeFunction("ConnectToGroup", gameKeyRef.current, pseudoId);
        if (invokeResult.isError()) {
          console.error("Failed to rejoin group after reconnect:", invokeResult.error);
          giveUpAndGoHome();
          return;
        }

        closeLoadingModal();
      });

      hubConnection.onclose(() => {
        if (disconnectTriggeredRef.current) return;

        if (debugDisconnectInProgressRef.current) {
          console.warn("DEBUG: Connection closed while testing reconnect");
          return;
        }

        console.error("Connection closed permanently (all reconnect attempts failed)");
        giveUpAndGoHome();
      });

      await hubConnection.start();
      connectionRef.current = hubConnection;

      console.info(`Established connection: ${hubAddress}`);
      return ok(hubConnection);
    } catch (error) {
      return err("En feil skjedde ved tilkoblingen. (HubConnectionProvider)");
    }
  }

  async function disconnect(): Promise<Result> {
    try {
      disconnectTriggeredRef.current = true;

      if (!connectionRef.current) {
        clearValues();
        return ok();
      }

      await connectionRef.current.stop();
      clearValues();
      return ok();
    } catch (error) {
      clearValues();
      console.error("Failed to close down websocket");
      return err("Failed to close down websocket");
    }
  }

  async function debugDisconnect(): Promise<void> {
    try {
      if (!connectionRef.current) {
        console.warn("No connection to disconnect");
        return;
      }

      console.info("DEBUG: Forcing disconnect to test reconnection");
      debugDisconnectInProgressRef.current = true;

      const transport = (connectionRef.current as any).connection?.transport;
      const ws = transport?._webSocket ?? transport?.webSocket;

      if (ws) {
        ws.close();
      } else if (transport && typeof transport.stop === "function") {
        transport.stop();
      } else {
        console.warn("DEBUG: transport not accessible — cannot simulate disconnect");
        debugDisconnectInProgressRef.current = false;
      }
    } catch (error) {
      debugDisconnectInProgressRef.current = false;
      console.error("DEBUG: Failed to force disconnect", error);
    }
  }

  function setListener<T>(channel: string, fn: (item: T) => void): Result {
    try {
      if (!connectionRef.current) {
        return err("Ingen tilkobling opprettet. (HubConnectionProvider)");
      }

      listenersMapRef.current.set(channel, fn);
      connectionRef.current.off(channel);
      connectionRef.current.on(channel, fn);

      return ok();
    } catch (error) {
      console.error("setListener");
      return err("Noe gikk galt.");
    }
  }

  async function invokeFunction(functionName: string, ...params: any[]): Promise<Result<any>> {
    try {
      if (!connectionRef?.current || disconnectTriggeredRef.current) {
        return err("Ingen tilkobling opprettet.");
      }

      const state: any = await connectionRef.current?.invoke(functionName, ...params);
      return ok(state);
    } catch (error) {
      console.error("invokeFunction", error);
      return err("Tilkoblingen ble brutt");
    }
  }

  const reattachListeners = () => {
    if (!connectionRef.current) {
      console.warn("Cannot reattach listeners - no connection");
      return;
    }

    console.info(`Reattaching ${listenersMapRef.current.size} listeners after reconnection`);
    listenersMapRef.current.forEach((fn, channel) => {
      connectionRef.current!.off(channel);
      connectionRef.current!.on(channel, fn);
    });
  };

  const clearValues = () => {
    connectionRef.current = undefined;
    hubNameRef.current = undefined;
    listenersMapRef.current.clear();
    disconnectTriggeredRef.current = false;
    debugDisconnectInProgressRef.current = false;
    gameKeyRef.current = "";
  };

  const value = {
    invokeFunction,
    setListener,
    connect,
    disconnect,
    debugDisconnect,
  };

  return <HubConnectionContext.Provider value={value}>{children}</HubConnectionContext.Provider>;
};

export default HubConnectionProvider;
