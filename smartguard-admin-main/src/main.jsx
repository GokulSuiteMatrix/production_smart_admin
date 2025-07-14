import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css"
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";

async function main() {
  await msalInstance.initialize();

  // Handle redirect promise
  msalInstance.handleRedirectPromise().catch(error => {
    console.error(error);
  });

  // Default to using the first account if no account is active
  if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  // Optional - This will update account state if a user signs in from another tab/window
  msalInstance.enableAccountStorageEvents();

  // Render the application
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
}

main();
