import { API_URL } from "../config/api";

export async function publicFetch(url) {
  const res = await fetch(`${API_URL}${url}`);
  return res.json();
}
