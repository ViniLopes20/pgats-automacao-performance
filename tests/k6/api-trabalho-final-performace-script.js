import http from "k6/http";
import { sleep, check, group } from "k6";

export const options = {
  vus: 10,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(90)<=10", "p(95)<=10"],
    http_req_failed: ["rate<0.01"],
  },
};

export function setup() {
  const uniqueUser = `vini+${Date.now()}@test.com`;

  const responseAddUser = http.post(
    "http://localhost:2000/usuarios",
    JSON.stringify({
      login: uniqueUser,
      password: "12345678",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(responseAddUser, {
    "Status da response de Cadastro de usuário está igual a 201": (
      responseAddUser
    ) => responseAddUser.status === 201,
    "Mensagem da response de Cadastro de usuário está correta": (
      responseAddUser
    ) => responseAddUser.json("message") === "Usuário cadastrado com sucesso",
  });
  return { login: uniqueUser, password: "12345678" };
}

export default function (data) {
  let responseUserLogin;

  group("Realizando login com uma conta de usuário", function () {
    responseUserLogin = http.post(
      "http://localhost:2000/login",
      JSON.stringify({
        login: data.login,
        password: data.password,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    check(responseUserLogin, {
      "Status da response de Login do usuário está igual a 200": (
        responseUserLogin
      ) => responseUserLogin.status === 200,
    });
  });

  group("Cadastro de novo aluno", function () {
    let responseAddAluno = http.post(
      "http://localhost:2000/alunos",
      JSON.stringify({
        nome: `Vinicius Teste Performance ${Date.now()}`,
      }),
      {
        headers: {
          Authorization: `Bearer ${responseUserLogin.json("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    check(responseAddAluno, {
      "Status da response de Cadastro de Aluno está igual a 201": (
        responseAddAluno
      ) => responseAddAluno.status === 201,
      "Mensagem da response de Cadastro de Aluno está correta": (
        responseAddAluno
      ) => responseAddAluno.json("message") === "Aluno cadastrado com sucesso",
    });
  });

  sleep(1);
}
