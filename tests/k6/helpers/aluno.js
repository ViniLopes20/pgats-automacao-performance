import http from "k6/http";
import { baseURL } from "./baseURL.js";

export function addAluno(nome, token) {
  const url = `${baseURL()}/alunos`;
  const payload = JSON.stringify({ nome });
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return http.post(url, payload, params);
}

export function listAluno(token) {
  const url = `${baseURL()}/alunos`;
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return http.get(url, params);
}
