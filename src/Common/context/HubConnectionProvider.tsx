import * as signalR from "@microsoft/signalr";
import React, { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { useModalProvider } from "./ModalProvider";
import { useNavigation } from "expo-router";
import { ok, err, Result } from "../utils/result";
import { resetToHomeScreen } from "../utils/navigation";
import { useAuthProvider } from "./AuthProvider";
import { useGlobalSessionProvider } from "./GlobalSessionProvider";

interface IHubConnectionContext {
  connect: (hubAddress: string) => Promise<Result<signalR.HubConnection>>;
  disconnect: () => Promise<Result>;
  debugDisconnect: () => Promise<void>;
  setListener: <T>(channel: string, fn: (item: T) => void) => Result;
  invokeFunction: (functionName: string, ...params: any[]) => Promise<Result<any>>;
}

const defaultContextValue: IHubConnectionContext = {
  connect: async (_hubAddress: string) => err(""),
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
  const connectedStateRef = useRef<boolean>(false);
  const disconnectTriggeredRef = useRef<boolean>(false);
  const hubAddressRef = useRef<string | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const listenersMapRef = useRef<Map<string, (item: any) => void>>(new Map());
  const gameKeyRef = useRef<string>("");

  const { gameKey } = useGlobalSessionProvider();
  const { displayLoadingModal, closeLoadingModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();
  const navigation: any = useNavigation();

  useEffect(() => {
    gameKeyRef.current = gameKey;
  }, [gameKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectionRef.current) return;

      if (connectedStateRef.current && !connectionRef.current && !isReconnectingRef.current) {
        handleConnectionLost();
        return;
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  const handleConnectionLost = async () => {
    if (disconnectTriggeredRef.current) {
      console.debug("Skipping reconnect, user triggered disconnect");
      return;
    }

    if (isReconnectingRef.current) {
      console.debug("Already reconnecting");
      return;
    }

    isReconnectingRef.current = true;
    reconnectAttemptsRef.current = 0;

    displayLoadingModal(() => {
      closeLoadingModal();
      clearValues();
      resetToHomeScreen(navigation);
    });

    const reconnected = await attemptReconnect();

    if (!reconnected) {
      clearValues();
      closeLoadingModal();
      resetToHomeScreen(navigation);
      return;
    }

    closeLoadingModal();
    connectedStateRef.current = true;
    reconnectAttemptsRef.current = 0;
    isReconnectingRef.current = false;

    reattachListeners();

    let invokeResult = await invokeFunction("ConnectToGroup", gameKeyRef.current, pseudoId, true);
    if (invokeResult.isError()) {
      console.error("Failed to invoke reconnect function:", invokeResult.error);
      clearValues();
      resetToHomeScreen(navigation);
    }
  };

  const attemptReconnect = async (): Promise<boolean> => {
    const maxAttempts = 5;
    const baseDelay = 1000;

    if (!hubAddressRef.current) {
      console.error("Failed to reconnect to hub. Address is undefined");
      return false;
    }

    while (reconnectAttemptsRef.current < maxAttempts) {
      const delay = baseDelay * Math.pow(2, reconnectAttemptsRef.current);
      console.warn(`Reconnect attempt ${reconnectAttemptsRef.current + 1}/${maxAttempts} after ${delay}ms`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      const result = await connect(hubAddressRef.current);

      if (result.isError()) {
        reconnectAttemptsRef.current++;
        console.debug("Reconnect error:", result.error);
        continue;
      }

      let connection = result.value;
      connectionRef.current = connection;

      console.info("Reconnected successfully");
      return true;
    }

    console.error("Failed to reconnect after max attempts");
    return false;
  };

  async function connect(hubAddress: string): Promise<Result<signalR.HubConnection>> {
    try {
      hubAddressRef.current = hubAddress;
      if (connectionRef.current) {
        const curHubName = (connectionRef.current as any)._hubName;

        if (curHubName !== hubAddress) {
          return err("Finnes allerede en åpen socket til feil hub. (HubConnectionProvider)");
        }

        return ok(connectionRef.current);
      }

      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubAddress)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      (hubConnection as any)._hubName = hubAddress;

      await hubConnection.start();
      hubConnection.onclose(async () => {
        if (connectedStateRef.current && !isReconnectingRef.current) {
          connectionRef.current = undefined;
          await handleConnectionLost();
          return;
        }

        clearValues();
      });

      connectionRef.current = hubConnection;
      connectedStateRef.current = true;

      console.info(`Established connection: ${hubAddress}`);
      return ok(hubConnection);
    } catch (error) {
      connectedStateRef.current = false;
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
      // Just stop the connection - this will trigger onclose handler
      // which will detect it as unexpected and trigger reconnection
      await connectionRef.current.stop();
    } catch (error) {
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
      if (!connectionRef?.current) {
        return err("Ingen tilkobling opprettet.");
      }

      let state: any = await connectionRef.current?.invoke(functionName, ...params);
      return ok(state);
    } catch (error) {
      console.error("invokeFunction", error);
      return err("Tilkoblingen ble butt");
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
    reconnectAttemptsRef.current = 0;
    isReconnectingRef.current = false;
    connectedStateRef.current = false;
    hubAddressRef.current = undefined;
    listenersMapRef.current.clear();
    disconnectTriggeredRef.current = false;
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
