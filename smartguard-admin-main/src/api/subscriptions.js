import axios from "axios";
import { msalInstance } from "../msalInstance";
import { loginRequest } from "../MSALConfig";

export async function fetchSubscriptions() {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
  const tokenResponse = await msalInstance.acquireTokenSilent({ account, ...loginRequest });
  const response = await axios.get("https://guard-api-production.up.railway.app/api/admin/subscriptions", {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin"
    }
  });
  return response.data.subscriptions;
}
export async function fetchSubscriptionById(id) {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No account found. User not logged in.");
  
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account,
      ...loginRequest,
    });
  
    const response = await axios.get(`https://guard-api-production.up.railway.app/api/admin/subscriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      }
    });
    return response.data;
  }

// Add more functions for create, update, delete as needed
