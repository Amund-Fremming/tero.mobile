import { initializeApp, getApps } from "firebase/app";
import { fetchAndActivate, getRemoteConfig, getValue } from "firebase/remote-config";
import { DEV_URL_CONFIG, UrlConfig } from "./api";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export async function fetchRemoteUrlConfig(): Promise<UrlConfig> {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const remoteConfig = getRemoteConfig(app);

  remoteConfig.defaultConfig = {
    hub_url_base: DEV_URL_CONFIG.hubUrlBase,
    platform_url_base: DEV_URL_CONFIG.platformUrlBase,
    session_url_base: DEV_URL_CONFIG.sessionUrlBase,
  };

  await fetchAndActivate(remoteConfig);

  return {
    hubUrlBase: getValue(remoteConfig, "hub_url_base").asString(),
    platformUrlBase: getValue(remoteConfig, "platform_url_base").asString(),
    sessionUrlBase: getValue(remoteConfig, "session_url_base").asString(),
  };
}
