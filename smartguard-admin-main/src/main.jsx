import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import ReactGA from "react-ga4";
 
// 👉 Initialize GA4 (replace with your real Measurement ID)
ReactGA.initialize("G-NN0DR5E07Z");
 
async function main() {
  await msalInstance.initialize();
 
  // Handle redirect promise
  msalInstance.handleRedirectPromise().catch((error) => {
    console.error(error);
  });
 
  // Set default account if none is active
  if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }
 
  // Enable multi-tab account sync
  msalInstance.enableAccountStorageEvents();
 
  // 👉 Send initial pageview
  ReactGA.send("pageview");
 
  // Render the app
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
}
 
main();