

const isProd = window.location.hostname !== "localhost";

export const msalConfig = {
  auth: {
    clientId: "9f09f3b0-2ee9-454e-861f-a22e951244a1", 
    authority: "https://login.microsoftonline.com/117992cf-73a3-44be-9132-39234e9fdca7", // Directory (tenant) ID from Azure
    redirectUri: isProd
      ? "https://production-smart-admin-hkac.vercel.app/login"
      : "http://localhost:3000",
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

// Add authentication request configuration
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"]
};

// Remove the msalInstance creation and handleRedirectPromise from here
// We'll handle this in main.jsx instead

