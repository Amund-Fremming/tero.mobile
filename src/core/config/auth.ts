import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";

const CLIENT_ID = Constants.expoConfig?.extra?.auth0ClientId ?? "";
const DOMAIN = Constants.expoConfig?.extra?.auth0Domain ?? "";
const SCHEME = "com.tero";
const AUDIENCE = "https://api.tero.com";

interface IAuth0Config {
  domain: string;
  clientId: string;
  audience: string;
  redirectUri: string;
  discovery: IDiscovery;
}

interface IDiscovery {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  revocationEndpoint: string;
}

const discovery: IDiscovery = {
  authorizationEndpoint: `https://${DOMAIN}/authorize`,
  tokenEndpoint: `https://${DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${DOMAIN}/oauth/revoke`,
};

export const Auth0Config: IAuth0Config = {
  domain: DOMAIN,
  clientId: CLIENT_ID,
  audience: AUDIENCE,
  redirectUri: __DEV__
    ? AuthSession.makeRedirectUri({ preferLocalhost: true, scheme: SCHEME })
    : `${SCHEME}://callback`,
  discovery,
};
