import http from "k6/http";
import { BASE_URL } from "./baseURL.js";

/**
 * Realiza o login e retorna a resposta da requisição
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {object} response - Resposta da requisição de login
 */
export function loginRequest(email, password) {
  return http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: email,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
