import { sleep, check, group } from "k6";
import { SharedArray } from "k6/data";
import { login } from "./helpers/login.js";

const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/usuarios.json"));
});

export const options = {
  vus: 100,
  interactions: 5,
  thresholds: {
    http_req_duration: ["p(90)<=20", "p(95)<=20"],
    http_req_failed: ["rate<0.01"],
  },
  stages: [
    { duration: "3s", target: 10 },
    { duration: "15s", target: 50 },
    { duration: "5s", target: 100 },
    { duration: "10s", target: 50 },
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  const userData = users[(__VU - 1) % users.length];

  group("Login com credenciais válidas", function () {
    const responseLogin = login(userData.login, userData.password);

    check(responseLogin, {
      "Login status é 200": (responseLogin) => responseLogin.status === 200,
      "Login tem token JWT": (responseLogin) => !!responseLogin.json().token,
    });
  });

  sleep(1);
}
