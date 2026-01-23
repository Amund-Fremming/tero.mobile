import * as signalR from "@microsoft/signalr";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useModalProvider } from "./ModalProvider";
import { useNavigation } from "expo-router";
import Screen from "../constants/Screen";
import { ok, err, Result } from "../utils/result";

interface IHubConnectionContext {
  connect: (hubAddress: string) => Promise<Result<signalR.HubConnection>>;
  disconnect: () => Promise<Result>;
  debugDisconnect: () => Promise<void>;
  setListener: <T>(channel: string, fn: (item: T) => void) => Result;
  invokeFunction: (functionName: string, ...params: any[]) => Promise<Result>;
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
  const [connection, setConnection] = useState<signalR.HubConnection | undefined>(undefined);
  const [connectedState, setConnectedState] = useState<boolean>(false);
  const [hubAddress, setHubAddress] = useState<string>("");

  const connectionRef = useRef(connection);
  const connectedStateRef = useRef(connectedState);
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);

  const { displayErrorModal, displayLoadingModal, closeLoadingModal } = useModalProvider();
  const navigation: any = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      // Only check if we think we should be connected
      if (!connectedStateRef.current) return;

      // If we lost connection unexpectedly
      if (connectedStateRef.current && !connectionRef.current && !isReconnectingRef.current) {
        handleConnectionLost();
        return;
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  const handleConnectionLost = async () => {
    if (isReconnectingRef.current || !hubAddress) return;

    isReconnectingRef.current = true;
    reconnectAttemptsRef.current = 0;

    displayLoadingModal(() => {
      navigation.navigate(Screen.Home); // This can cause nagivation stack mix up causing user to be reconnected to a game?
      connectionRef.current = undefined;
      reconnectAttemptsRef.current = 0;
      isReconnectingRef.current = false;
    });

    const reconnected = await attemptReconnect();

    if (reconnected) {
      closeLoadingModal();
      reconnectAttemptsRef.current = 0;
      isReconnectingRef.current = false;
    } else {
      clearValues();
      closeLoadingModal();
      isReconnectingRef.current = false;
    }
  };

  const attemptReconnect = async (): Promise<boolean> => {
    const maxAttempts = 5;
    const baseDelay = 1000; // 1 second
    if (!isReconnectingRef.current) {
      clearValues();
    }
    while (reconnectAttemptsRef.current < maxAttempts) {
      const delay = baseDelay * Math.pow(2, reconnectAttemptsRef.current);
      console.warn(`Reconnect attempt ${reconnectAttemptsRef.current + 1}/${maxAttempts} after ${delay}ms`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      const result = await connect(hubAddress);

      if (result.isSuccess()) {
        console.info("Reconnected successfully");
        return true;
      }

      reconnectAttemptsRef.current++;
    }

    console.error("Failed to reconnect after max attempts");
    return false;
  };

  async function connect(hubAddress: string): Promise<Result<signalR.HubConnection>> {
    try {
      setHubAddress(hubAddress);
      if (connectionRef.current) {
        const curHubName = (connectionRef.current as any)._hubName;
        const curHubId = (connectionRef.current as any)._hubId;

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
        clearValues();
      });

      setConnection(hubConnection);
      connectionRef.current = hubConnection;
      setConnectedState(true);
      connectedStateRef.current = true;

      console.info(`Established connection: ${hubAddress}`);
      return ok(hubConnection);
    } catch (error) {
      setConnectedState(false);
      return err("En feil skjedde ved tilkoblingen. (HubConnectionProvider)");
    }
  }

  async function disconnect(): Promise<Result> {
    try {
      if (!connectionRef.current) {
        clearValues();
        return ok();
      }

      await connectionRef.current.stop();
      await connection?.stop();
      clearValues();

      console.info("Manually disconnected user");
      return ok();
    } catch (error) {
      clearValues();
      setConnectedState(false);
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
      await connectionRef.current.stop();
      // Don't clear values - simulate unexpected disconnect
    } catch (error) {
      console.error("DEBUG: Failed to force disconnect", error);
    }
  }

  function setListener<T>(channel: string, fn: (item: T) => void): Result {
    try {
      if (!connectionRef.current) {
        return err("Ingen tilkobling opprettet. (HubConnectionProvider)");
      }

      // Overwrite old listeners
      connectionRef.current.off(channel);
      connectionRef.current.on(channel, fn);

      return ok();
    } catch (error) {
      console.error("setListener");
      return err("Noe gikk galt.");
    }
  }

  async function invokeFunction(functionName: string, ...params: any[]): Promise<Result> {
    try {
      if (!connectionRef?.current) {
        return err("Ingen tilkobling opprettet.");
      }

      await connectionRef.current?.invoke(functionName, ...params);
      return ok();
    } catch (error) {
      console.error("invokeFunction", error);
      return err("Tilkoblingen ble butt");
    }
  }

  const clearValues = () => {
    setConnection(undefined);
    connectionRef.current = undefined;
    reconnectAttemptsRef.current = 0;
    isReconnectingRef.current = false;
    setConnectedState(false);
    connectedStateRef.current = false;
  };

  const value = {
    invokeFunction,
    setListener,
    connect,
    disconnect,
    debugDisconnect,
    setHubAddress,
  };

  return <HubConnectionContext.Provider value={value}>{children}</HubConnectionContext.Provider>;
};

export default HubConnectionProvider;
