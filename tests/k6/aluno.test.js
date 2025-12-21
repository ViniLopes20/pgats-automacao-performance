import { check, group, sleep } from "k6";
import { Trend } from "k6/metrics";
import { login } from "./helpers/login.js";
import { SharedArray } from "k6/data";
import faker from "k6/x/faker";
import { addAluno, listAluno } from "./helpers/aluno.js";

const postAlunoTrend = new Trend("post_aluno_duration");

const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/usuarios.json"));
});

export const options = {
  vus: 100,
  duration: "20s",
  thresholds: {
    post_aluno_duration: ["p(95)<30"],
    http_req_duration: ["p(90)<=30", "p(95)<=30"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  let token;
  const userData = users[(__VU - 1) % users.length];

  group(
    "Login com credenciais válidas para obter o token de autenticação",
    function () {
      const responseLogin = login(userData.login, userData.password);
      token = responseLogin.json().token;
    }
  );

  group("Cadastrar novo aluno", function () {
    const alunoPayload = {
      nome: faker.person.firstName() + " " + faker.person.lastName(),
    };

    const responseAddAluno = addAluno(alunoPayload.nome, token);

    postAlunoTrend.add(responseAddAluno.timings.duration);

    check(responseAddAluno, {
      "Request de add aluno está com o status 201": (responseAddAluno) =>
        responseAddAluno.status === 201,
      "Mensagem de aluno cadastrado está correta": (responseAddAluno) =>
        responseAddAluno.json("message") === "Aluno cadastrado com sucesso",
    });
  });

  group("Listar Usuários", function () {
    const responseListAluno = listAluno(token);

    check(responseListAluno, {
      "Resquest para listar alunos está com o status 200": (
        responseListAluno
      ) => responseListAluno.status === 200,
    });
  });

  sleep(1);
}
