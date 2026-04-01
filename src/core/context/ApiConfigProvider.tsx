import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEV_URL_CONFIG, IUrlConfig } from "../config/api";
import { ENV } from "../config/env";
import { SANITY_API_URL } from "../config/sanity";

interface IApiConfigContext {
  urlConfig: IUrlConfig;
}

const ApiConfigContext = createContext<IApiConfigContext>({
  urlConfig: DEV_URL_CONFIG,
});

export const useApiConfig = () => useContext(ApiConfigContext);

async function fetchUrlConfigFromSanity(): Promise<IUrlConfig> {
  const query = encodeURIComponent('*[_type == "apiConfig"][0]{hubUrlBase, platformUrlBase, sessionUrlBase}');
  const response = await fetch(`${SANITY_API_URL}?query=${query}`);

  if (!response.ok) {
    throw new Error(`Sanity fetch failed with status ${response.status}`);
  }

  const data = await response.json();

  const result = data.result;
  if (
    !result ||
    typeof result.hubUrlBase !== "string" ||
    typeof result.platformUrlBase !== "string" ||
    typeof result.sessionUrlBase !== "string" ||
    !result.hubUrlBase ||
    !result.platformUrlBase ||
    !result.sessionUrlBase
  ) {
    throw new Error("Sanity apiConfig document is missing required URL fields");
  }

  return {
    hubUrlBase: result.hubUrlBase,
    platformUrlBase: result.platformUrlBase,
    sessionUrlBase: result.sessionUrlBase,
  };
}

interface ApiConfigProviderProps {
  children: ReactNode;
}

export const ApiConfigProvider = ({ children }: ApiConfigProviderProps) => {
  const [urlConfig, setUrlConfig] = useState<IUrlConfig | null>(ENV === "dev" ? DEV_URL_CONFIG : null);

  useEffect(() => {
    if (ENV === "dev") {
      return;
    }

    fetchUrlConfigFromSanity()
      .then(setUrlConfig)
      .catch((error) => {
        console.error("Failed to fetch URL config from Sanity:", error);
        setUrlConfig(DEV_URL_CONFIG);
      });
  }, []);

  if (!urlConfig) {
    return null;
  }

  return <ApiConfigContext.Provider value={{ urlConfig }}>{children}</ApiConfigContext.Provider>;
};

export default ApiConfigProvider;
