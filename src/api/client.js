const BASE_URL = "https://pem-backend-p90m.onrender.com";

function getToken() {
  return localStorage.getItem("pem_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("pem_token");
    window.location.href = "/login";
    return;
  }

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || "Request failed");
  return data;
}

export const api = {
  login: (body) => request("/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/register", { method: "POST", body: JSON.stringify(body) }),

  getAccounts: () => request("/accounts"),
  addAccount: (body) => request("/accounts/add", { method: "POST", body: JSON.stringify(body) }),
  deleteAccount: (id) => request(`/accounts/${id}`, { method: "DELETE" }),

  getTransactions: (accountId) => request(`/accounts/${accountId}/transactions`),
  addTransaction: (accountId, body) =>
    request(`/accounts/${accountId}/transactions`, { method: "POST", body: JSON.stringify(body) }),
};
