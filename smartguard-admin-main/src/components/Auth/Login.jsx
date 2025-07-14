// src/components/Auth/Login.jsx
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import MicrosoftLoginButton from "./MicrosoftLoginButton";
import { loginRequest } from "../../MSALConfig.js";

const Login = () => {
  const { instance, accounts, inProgress } = useMsal();
  

  useEffect(() => {
    // Add console logs to debug the flow
    console.log("Login component - Accounts:", accounts);
    console.log("Login component - inProgress:", inProgress);

    if (accounts.length > 0) {
      console.log("Attempting to acquire token...");
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        })
        .then((response) => {
          console.log("Access Token:", response.accessToken);
          console.log("Token acquired successfully");
          // Force navigation to dashboard after successful token acquisition
          // window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Silent token acquisition failed", error);
          if (error.name === "InteractionRequiredAuthError") {
            instance
              .acquireTokenRedirect(loginRequest)
              .catch((e) => console.error("Redirect error:", e));
          }
        });
    }
  }, [accounts, instance, inProgress]);

  // If authentication is in progress, show loading
  if (inProgress !== "none") {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg rounded-4 border-0">
              <div className="card-body p-4 p-md-5 position-relative bg-white">
                <div className="text-center mb-4">
                  <h3 className="fw-bold">SP Parent Control</h3>
                  <p className="text-muted mb-0">Securely manage your families</p>
                </div>
                <MicrosoftLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;