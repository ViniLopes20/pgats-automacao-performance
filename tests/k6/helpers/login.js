import http from "k6/http";
import { baseURL } from "./baseURL.js";

export function login(login, password) {
  const url = `${baseURL()}/login`;
  const payload = JSON.stringify({ login, password });
  const params = {
    headers: { "Content-Type": "application/json" },
  };

  return http.post(url, payload, params);
}
