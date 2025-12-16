import { API_URL } from "../config/api";

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
  ...options.headers,
};


  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
