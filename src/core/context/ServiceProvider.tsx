import React, { createContext, ReactNode, useContext, useRef } from "react";
import { GameService } from "../../play/services/gameService";
import { PLATFORM_URL_BASE, SESSION_URL_BASE } from "../config/api";
import { AdminService } from "../services/adminService";
import { UserService } from "../services/userService";
import { CommonService } from "../services/coreService";
import { useApiConfig } from "./ApiConfigProvider";

interface IServiceProviderContext {
  gameService: () => GameService;
  userService: () => UserService;
  commonService: () => CommonService;
  adminService: () => AdminService;
}

const ServiceProviderContext = createContext<IServiceProviderContext>({
  gameService: () => new GameService(PLATFORM_URL_BASE),
  userService: () => new UserService(PLATFORM_URL_BASE),
  commonService: () => new CommonService(PLATFORM_URL_BASE),
  adminService: () => new AdminService(SESSION_URL_BASE),
});

export const useServiceProvider = () => useContext(ServiceProviderContext);

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const { urlConfig } = useApiConfig();

  const gameServiceRef = useRef(new GameService(urlConfig.platformUrlBase));
  const userServiceRef = useRef(new UserService(urlConfig.platformUrlBase));
  const commonServiceRef = useRef(new CommonService(urlConfig.platformUrlBase));
  const adminServiceRef = useRef(new AdminService(urlConfig.sessionUrlBase));

  const gameService = () => gameServiceRef.current;
  const userService = () => userServiceRef.current;
  const commonService = () => commonServiceRef.current;
  const adminService = () => adminServiceRef.current;

  const value = {
    gameService,
    userService,
    commonService,
    adminService,
  };

  return <ServiceProviderContext.Provider value={value}>{children}</ServiceProviderContext.Provider>;
};

export default ServiceProvider;
