import http from "k6/http";
import { sleep, check, group } from "k6";

export const options = {
  vus: 10,
  // interactions: 1,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(90)<=10", "p(95)<=10"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  let responseInstructorLogin;
  let responseLesson;

  group("Realizando login com uma conta de instrutor", function () {
    responseInstructorLogin = http.post(
      "http://localhost:3000/instructors/login",
      JSON.stringify({
        email: "vini@test.com",
        password: "12345678",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    check(responseInstructorLogin, {
      "Status da response de login deve ser igual a 200": (
        responseInstructorLogin
      ) => responseInstructorLogin.status === 200,
    });
  });

  group("Criando uma nova lição", function () {
    responseLesson = http.post(
      "http://localhost:3000/lessons",
      JSON.stringify({
        title: "Criando lição do K6 6",
        description: "Criando descrição da lição do K6 6",
      }),
      {
        headers: {
          Authorization: `Bearer ${responseInstructorLogin.json("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    check(responseLesson, {
      "Status da responde de leasson deve ser igual a 201": (responseLesson) =>
        responseLesson.status === 201,
    });
  });

  sleep(1);
}
