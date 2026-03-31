import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEV_URL_CONFIG, UrlConfig } from "../config/api";
import { fetchRemoteUrlConfig } from "../config/firebaseConfig";

const UrlConfigContext = createContext<UrlConfig>(DEV_URL_CONFIG);

export const useUrlConfig = () => useContext(UrlConfigContext);

interface UrlConfigProviderProps {
  children: ReactNode;
}

export const UrlConfigProvider = ({ children }: UrlConfigProviderProps) => {
  const isProd = process.env.EXPO_PUBLIC_APP_ENV === "prod";
  const [urlConfig, setUrlConfig] = useState<UrlConfig | null>(isProd ? null : DEV_URL_CONFIG);

  useEffect(() => {
    if (!isProd) return;

    fetchRemoteUrlConfig()
      .then(setUrlConfig)
      .catch((error) => {
        console.warn("Failed to fetch remote config, falling back to dev URLs:", error);
        setUrlConfig(DEV_URL_CONFIG);
      });
  }, [isProd]);

  if (urlConfig === null) {
    return null;
  }

  return <UrlConfigContext.Provider value={urlConfig}>{children}</UrlConfigContext.Provider>;
};

export default UrlConfigProvider;
