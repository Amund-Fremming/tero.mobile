import React, { createContext, ReactNode, useContext, useRef } from "react";
import { GameService } from "../../play/services/gameService";
import { PLATFORM_URL_BASE, SESSION_URL_BASE } from "../config/api";
import { AdminService } from "../services/adminService";
import { AuditService } from "../services/auditService";
import { CommonService } from "../services/coreService";
import { UserService } from "../services/userService";

interface IServiceProviderContext {
  gameService: () => GameService;
  userService: () => UserService;
  commonService: () => CommonService;
  adminService: () => AdminService;
  auditService: () => AuditService;
}

const _defaultAudit = new AuditService(PLATFORM_URL_BASE);

const ServiceProviderContext = createContext<IServiceProviderContext>({
  gameService: () => new GameService(PLATFORM_URL_BASE, _defaultAudit),
  userService: () => new UserService(PLATFORM_URL_BASE, _defaultAudit),
  commonService: () => new CommonService(PLATFORM_URL_BASE),
  adminService: () => new AdminService(SESSION_URL_BASE),
  auditService: () => _defaultAudit,
});

export const useServiceProvider = () => useContext(ServiceProviderContext);

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const auditServiceRef = useRef(new AuditService(PLATFORM_URL_BASE));
  const gameServiceRef = useRef(new GameService(PLATFORM_URL_BASE, auditServiceRef.current));
  const userServiceRef = useRef(new UserService(PLATFORM_URL_BASE, auditServiceRef.current));
  const commonServiceRef = useRef(new CommonService(PLATFORM_URL_BASE));
  const adminServiceRef = useRef(new AdminService(SESSION_URL_BASE));

  const gameService = () => gameServiceRef.current;
  const userService = () => userServiceRef.current;
  const commonService = () => commonServiceRef.current;
  const adminService = () => adminServiceRef.current;
  const auditService = () => auditServiceRef.current;

  const value = {
    gameService,
    userService,
    commonService,
    adminService,
    auditService,
  };

  return <ServiceProviderContext.Provider value={value}>{children}</ServiceProviderContext.Provider>;
};

export default ServiceProvider;
