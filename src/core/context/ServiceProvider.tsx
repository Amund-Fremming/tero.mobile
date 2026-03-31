import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { GameService } from "../../play/services/gameService";
import { DEV_URL_CONFIG } from "../config/api";
import { AdminService } from "../services/adminService";
import { UserService } from "../services/userService";
import { CommonService } from "../services/coreService";
import { useUrlConfig } from "./UrlConfigProvider";

interface IServiceProviderContext {
  gameService: () => GameService;
  userService: () => UserService;
  commonService: () => CommonService;
  adminService: () => AdminService;
}

const ServiceProviderContext = createContext<IServiceProviderContext>({
  gameService: () => new GameService(DEV_URL_CONFIG.platformUrlBase),
  userService: () => new UserService(DEV_URL_CONFIG.platformUrlBase),
  commonService: () => new CommonService(DEV_URL_CONFIG.platformUrlBase),
  adminService: () => new AdminService(DEV_URL_CONFIG.sessionUrlBase),
});

export const useServiceProvider = () => useContext(ServiceProviderContext);

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const { platformUrlBase, sessionUrlBase } = useUrlConfig();

  const gameServiceInstance = useMemo(() => new GameService(platformUrlBase), [platformUrlBase]);
  const userServiceInstance = useMemo(() => new UserService(platformUrlBase), [platformUrlBase]);
  const commonServiceInstance = useMemo(() => new CommonService(platformUrlBase), [platformUrlBase]);
  const adminServiceInstance = useMemo(() => new AdminService(sessionUrlBase), [sessionUrlBase]);

  const gameService = () => gameServiceInstance;
  const userService = () => userServiceInstance;
  const commonService = () => commonServiceInstance;
  const adminService = () => adminServiceInstance;

  const value = {
    gameService,
    userService,
    commonService,
    adminService,
  };

  return <ServiceProviderContext.Provider value={value}>{children}</ServiceProviderContext.Provider>;
};

export default ServiceProvider;
