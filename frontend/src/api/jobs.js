import { publicFetch } from "./public";

export function getJobs() {
  return publicFetch("/jobs");
}

export function searchJobs(params) {
  const query = new URLSearchParams(params).toString();
  return publicFetch(`/jobs/search?${query}`);
}
