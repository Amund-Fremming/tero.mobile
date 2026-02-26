import * as AuthSession from "expo-auth-session";

const CLIENT_ID = "vcrgS1imJrANviUILgZ7xlq6YZFbPnQD";
const DOMAIN = "dev-tero.eu.auth0.com";
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
  redirectUri: AuthSession.makeRedirectUri({ preferLocalhost: true, scheme: SCHEME }),
  discovery,
};
