import axios from "axios";

axios.defaults.timeout = 30000;

axios.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config || config._retryCount >= 1) return Promise.reject(error);
  config._retryCount = (config._retryCount || 0) + 1;
  await new Promise((r) => setTimeout(r, 1000));
  return axios(config);
});

type Environment = "dev" | "prd";

const ENVIRONMENT: Environment = "prd";

const URL_CONFIG: Record<Environment, { hubUrlBase: string; platformUrlBase: string; sessionUrlBase: string }> = {
  dev: {
    hubUrlBase: "http://127.0.0.1:9000/hubs",
    platformUrlBase: "http://127.0.0.1:3000",
    sessionUrlBase: "http://127.0.0.1:9000",
  },
  prd: {
    hubUrlBase: "https://terosession-production-34ce.up.railway.app/hubs",
    sessionUrlBase: "https://terosession-production-34ce.up.railway.app",
    platformUrlBase: "https://teroplatform-production-4784.up.railway.app",
  },
};

export const HUB_URL_BASE = URL_CONFIG[ENVIRONMENT].hubUrlBase;
export const PLATFORM_URL_BASE = URL_CONFIG[ENVIRONMENT].platformUrlBase;
export const SESSION_URL_BASE = URL_CONFIG[ENVIRONMENT].sessionUrlBase;
