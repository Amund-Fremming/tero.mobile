export interface IUrlConfig {
  hubUrlBase: string;
  platformUrlBase: string;
  sessionUrlBase: string;
}

/// Local setup (used when ENV = "dev")
export const DEV_URL_CONFIG: IUrlConfig = {
  hubUrlBase: "http://127.0.0.1:9000/hubs",
  platformUrlBase: "http://127.0.0.1:3000",
  sessionUrlBase: "http://127.0.0.1:9000",
};

/// Local port forarding setup
// export const DEV_URL_CONFIG: IUrlConfig = {
//   hubUrlBase: "https://5008-217-13-29-59.ngrok-free.app/hubs",
//   platformUrlBase: "https://4cf7-217-13-29-59.ngrok-free.app",
//   sessionUrlBase: "https://5008-217-13-29-59.ngrok-free.app",
// };

export const HUB_URL_BASE = DEV_URL_CONFIG.hubUrlBase;
export const PLATFORM_URL_BASE = DEV_URL_CONFIG.platformUrlBase;
export const SESSION_URL_BASE = DEV_URL_CONFIG.sessionUrlBase;
