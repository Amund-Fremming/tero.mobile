type Environment = "dev" | "prd";

const ENVIRONMENT: Environment = "dev";

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
