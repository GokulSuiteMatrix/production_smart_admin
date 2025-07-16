import axios from "axios";
import { msalInstance } from "../msalInstance";
import { loginRequest } from "../MSALConfig";
 
export async function fetchSubscriptions({ page = 1, limit = 10, timePeriod = 'yearly', startDate = null, endDate = null } = {}) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
  const tokenResponse = await msalInstance.acquireTokenSilent({ account, ...loginRequest });
 
  let queryParams = [];
  if (timePeriod) queryParams.push(`period=${encodeURIComponent(timePeriod)}`);
  if (page) queryParams.push(`page=${page}`);
  if (limit) queryParams.push(`limit=${limit}`);
  if (startDate) queryParams.push(`start_date=${encodeURIComponent(startDate)}`);
  if (endDate) queryParams.push(`end_date=${encodeURIComponent(endDate)}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
 
  const response = await axios.get(`https://guard-api-production.up.railway.app/api/admin/subscriptions${queryString}`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin"
    }
  });
  return response.data;
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