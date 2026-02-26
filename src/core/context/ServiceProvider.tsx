import React, { createContext, ReactNode, useContext, useRef } from "react";
import { GameService } from "../../play/services/gameService";
import { PLATFORM_URL_BASE } from "../config/api";
import { UserService } from "../services/userService";
import { CommonService } from "../services/coreService";

interface IServiceProviderContext {
  gameService: () => GameService;
  userService: () => UserService;
  commonService: () => CommonService;
}

const ServiceProviderContext = createContext<IServiceProviderContext>({
  gameService: () => new GameService(PLATFORM_URL_BASE),
  userService: () => new UserService(PLATFORM_URL_BASE),
  commonService: () => new CommonService(PLATFORM_URL_BASE),
});

export const useServiceProvider = () => useContext(ServiceProviderContext);

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const gameServiceRef = useRef(new GameService(PLATFORM_URL_BASE));
  const userServiceRef = useRef(new UserService(PLATFORM_URL_BASE));
  const commonServiceRef = useRef(new CommonService(PLATFORM_URL_BASE));

  const gameService = () => gameServiceRef.current;
  const userService = () => userServiceRef.current;
  const commonService = () => commonServiceRef.current;

  const value = {
    gameService,
    userService,
    commonService,
  };

  return <ServiceProviderContext.Provider value={value}>{children}</ServiceProviderContext.Provider>;
};

export default ServiceProvider;
