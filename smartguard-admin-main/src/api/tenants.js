import axios from "axios";
import { msalInstance } from "../msalInstance";
import { loginRequest } from "../MSALConfig";
 
// Helper to format date as YYYY-MM-DD in local time
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
 
export async function fetchTenants(customStartDate = null, customEndDate = null, page = 1, limit = 10) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  let queryParams = [];
  let start_date = null;
  let end_date = null;
 
  if (customStartDate && customEndDate) {
    start_date = formatDateLocal(customStartDate);
    // Always add one day to end_date to make the range inclusive
    const nextDay = new Date(customEndDate);
    nextDay.setDate(nextDay.getDate() + 1);
    end_date = formatDateLocal(nextDay);
    console.log('[fetchTenants] start_date:', start_date, 'end_date:', end_date);
    queryParams.push(`start_date=${start_date}`, `end_date=${end_date}`);
  }
 
  queryParams.push(`page=${page}`, `limit=${limit}`);
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  const apiUrl = `https://guard-api-production.up.railway.app/api/admin/tenants${queryString}`;
  console.log('[fetchTenants] API URL:', apiUrl);
 
  const response = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin",
    },
  });
 
  console.log('[fetchTenants] API response:', response.data);
  return response.data;
}
 
export async function fetchTenantById(id) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  const response = await axios.get(`https://guard-api-production.up.railway.app/api/tenants/${id}`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin",
    }
  });
  return response.data;
}
 
export async function deleteTenant(id) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  await axios.delete(`https://guard-api-production.up.railway.app/api/tenants/${id}`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      "x-user-type": "admin"
    }
  });
}
 
export async function updateTenant(id, updatedData) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  const response = await axios.put(
    `https://guard-api-production.up.railway.app/api/tenants/${id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin"
      }
    }
  );
  return response.data;
}
 
export async function fetchChildrenAndDevices(tenantId) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/tenants/${tenantId}/children`,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
  return response.data;
}
 
export async function searchTenantsByFamilyName(familyName) {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No account found. User not logged in.");
 
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    ...loginRequest,
  });
 
  const response = await axios.get(
    `https://guard-api-production.up.railway.app/api/admin/tenants?familySearch=${encodeURIComponent(familyName)}`,
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "x-user-type": "admin",
      },
    }
  );
 
  return response.data.tenants;
}