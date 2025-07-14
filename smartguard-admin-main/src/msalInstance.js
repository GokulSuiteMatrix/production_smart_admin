import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./MSALConfig";

export const msalInstance = new PublicClientApplication(msalConfig);
