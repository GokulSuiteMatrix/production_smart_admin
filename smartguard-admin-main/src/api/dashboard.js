import axios from "axios";
import { msalInstance } from "../msalInstance";
import { loginRequest } from "../MSALConfig";

export async function fetchDashboardStats() {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");

  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });

  const response = await axios.get("https://guard-api-production.up.railway.app/api/admin/dashboard/stats", {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin",
    },
  });

  return response.data;
}

export async function fetchGrowthRate(period = "monthly") {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");

  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });

  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/dashboard/growth-rate?period=${period}`,
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

export async function fetchFamilyGrowth(period = 'monthly') {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");

  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });

  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/dashboard/family-growth?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );

  return response.data;
}

export async function fetchSubscriptionDistribution() {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");

  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });

  const response = await axios.get(
    "https://guard-api-production.up.railway.app/api/admin/dashboard/subscription-distribution",
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