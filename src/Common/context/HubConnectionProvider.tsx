import * as signalR from "@microsoft/signalr";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useModalProvider } from "./ModalProvider";
import { HUB_URL_BASE } from "../constants/Endpoints";
import { useNavigation } from "expo-router";
import Screen from "../constants/Screen";
import { ok, err, Result } from "../utils/result";

interface IHubConnectionContext {
  connect: (hubAddress: string) => Promise<Result<signalR.HubConnection>>;
  disconnect: () => Promise<Result>;
  setListener: <T>(channel: string, fn: (item: T) => void) => Result;
  invokeFunction: (functionName: string, ...params: any[]) => Promise<Result>;
}

const defaultContextValue: IHubConnectionContext = {
  connect: async (_hubName: string) => err(""),
  disconnect: async () => err(""),
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

  const connectionRef = useRef(connection);
  const connectedStateRef = useRef(connectedState);

  const { displayErrorModal } = useModalProvider();
  const navigation: any = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectedStateRef.current) return;
      if (!connectedStateRef.current && connectionRef.current) {
        disconnect();
        return;
      }

      if (!connectionRef.current) {
        // TODO - For games with hub call invalidate user from the correct api.
        clearValues();
        displayErrorModal("Du mistet tilkoblingen, vennligst forsøk å koble til igjen.", () =>
          navigation.navigate(Screen.Home)
        );
        return;
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  async function connect(hubAddress: string): Promise<Result<signalR.HubConnection>> {
    try {
      if (connectionRef.current) {
        const curHubName = (connectionRef.current as any)._hubName;
        const curHubId = (connectionRef.current as any)._hubId;

        if (curHubName !== hubAddress) {
          return err("Finnes allerede en åpen socket til feil hub. (HubConnectionProvider)");
        }

        console.info(`Returning established connection: ${curHubName}:${curHubId}`);
        return ok(connectionRef.current);
      }

      console.warn("Address:", hubAddress);
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

      console.info("Created hub connection");
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
    setConnectedState(false);
    connectedStateRef.current = false;
  };

  const value = {
    invokeFunction,
    setListener,
    connect,
    disconnect,
  };

  return <HubConnectionContext.Provider value={value}>{children}</HubConnectionContext.Provider>;
};

export default HubConnectionProvider;
