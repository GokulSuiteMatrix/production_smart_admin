import axios from "axios";
import { msalInstance } from "../msalInstance";
import { loginRequest } from "../MSALConfig";
 
export async function fetchDashboardStats(period = "monthly", start_date = null, end_date = null) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  let queryParams = [];
  if (period) queryParams.push(`period=${encodeURIComponent(period)}`);
  if (start_date) queryParams.push(`start_date=${encodeURIComponent(start_date)}`);
  if (end_date) queryParams.push(`end_date=${encodeURIComponent(end_date)}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
 
  const response = await axios.get(`https://guard-api-production.up.railway.app/api/admin/dashboard/stats${queryString}`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin",
    },
  });
 
  return response.data;
}
 
export async function fetchGrowthRate(period = "monthly", start_date = null, end_date = null) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  let queryParams = [];
  if (period) queryParams.push(`period=${encodeURIComponent(period)}`);
  if (start_date) queryParams.push(`start_date=${encodeURIComponent(start_date)}`);
  if (end_date) queryParams.push(`end_date=${encodeURIComponent(end_date)}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
 
  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/dashboard/growth-rate${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
 
  return response.data;
}
 
export async function fetchRecentActivity() {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  const response = await axios.get(
    "https://guard-api-production.up.railway.app/api/admin/dashboard/recent-activity",
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
 
  return response.data;
}
 
export async function fetchFamilyGrowth(period = 'monthly', start_date = null, end_date = null) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  let queryParams = [];
  if (period) queryParams.push(`period=${encodeURIComponent(period)}`);
  if (start_date) queryParams.push(`start_date=${encodeURIComponent(start_date)}`);
  if (end_date) queryParams.push(`end_date=${encodeURIComponent(end_date)}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
 
  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/dashboard/family-growth${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
 
  return response.data;
}
 
export async function fetchSubscriptionDistribution(period = 'monthly', start_date = null, end_date = null) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  let queryParams = [];
  if (period) queryParams.push(`period=${encodeURIComponent(period)}`);
  if (start_date) queryParams.push(`start_date=${encodeURIComponent(start_date)}`);
  if (end_date) queryParams.push(`end_date=${encodeURIComponent(end_date)}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
 
  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/dashboard/subscription-distribution${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
 
  return response.data;
}
 
export async function fetchDeviceCounts() {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  const response = await axios.get(
    "https://guard-api-production.up.railway.app/api/admin/device-counts",
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
 
  return response.data;
}