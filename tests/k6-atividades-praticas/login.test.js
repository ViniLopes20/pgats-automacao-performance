import http from "k6/http";
import { sleep, check, group } from "k6";
import { BASE_URL } from "./helpers/baseURL.js";

import { SharedArray } from "k6/data";

const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/login.test.data.json"));
});

export const options = {
  vus: 7,
  interactions: 10,
  thresholds: {
    http_req_duration: ["p(90)<=900", "p(95)<=900"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  //   const userData = users[__VU - 1];
  //   const userData = users[Math.floor(Math.random() * users.length)];
  const userData = users[(__VU - 1) % users.length];

  group("Login com credenciais válidas", function () {
    const responseLogin = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    check(responseLogin, {
      "Status da response do Login do Usuário está igual a 200": (
        responseLogin
      ) => responseLogin.status === 200,
      "Mensagem da response do Login do Usuário está correto": (
        responseLogin
      ) => responseLogin.json("message") === "Login successful",
    });
  });

  sleep(1);
}
