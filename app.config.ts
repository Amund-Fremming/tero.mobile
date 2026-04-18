import { ConfigContext, ExpoConfig } from "expo/config";

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID ?? "";
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? "";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "tero",
  description: "Tero – party games with friends. Create, join and play interactive games together.",
  icon: "./app/appstore.png",
  splash: {
    image: "./app/appstore.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  slug: "tero",
  version: "1.0.5",
  orientation: "portrait",
  platforms: ["ios"],
  scheme: "com.tero",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    infoPlist: {
      UIViewControllerBasedStatusBarAppearance: false,
      UIStatusBarHidden: false,
      ITSAppUsesNonExemptEncryption: false,
    },
    bundleIdentifier: "com.tero.app",
  },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        icon: "./app/tero.png",
        color: "#ffffff",
        sounds: [],
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    auth0ClientId: AUTH0_CLIENT_ID,
    auth0Domain: AUTH0_DOMAIN,
    router: {},
    eas: {
      projectId: "c76387d5-efdb-4f11-a38d-24ba7bebb528",
    },
  },
});
