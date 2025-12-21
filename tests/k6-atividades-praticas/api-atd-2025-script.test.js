import http from "k6/http";
import { loginRequest } from "./helpers/LoginRequest.js";
import { sleep, check, group } from "k6";
import { BASE_URL } from "./helpers/baseURL.js";

import faker from "k6/x/faker";

import { Trend } from "k6/metrics";
const postCheckoutDurationTrend = new Trend("post_checkout_duration");

export const options = {
  vus: 10,
  //   duration: "15s",
  //   interactions: 10,
  thresholds: {
    http_req_duration: ["p(90)<=900", "p(95)<=900"],
    http_req_failed: ["rate<0.01"],
  },
  stages: [
    { duration: "3s", target: 10 },
    { duration: "15s", target: 10 },
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  const REGISTER_URL = `${BASE_URL}/auth/register`;
  const PRODUCTS_URL = `${BASE_URL}/products`;
  const CHECKOUT_URL = `${BASE_URL}/checkout`;
  let responseLoginUser;
  let user = {
    email: faker.person.email(),
    password: faker.internet.password(),
    name: faker.person.firstName() + " " + faker.person.lastName(),
  };

  group("Cadastro de novo usuário", function () {
    const responseAddUser = http.post(
      REGISTER_URL,
      JSON.stringify({
        email: user.email,
        password: user.password,
        name: user.name,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    check(responseAddUser, {
      "Status da response de Cadastro de Usuário está igual a 201": (
        responseAddUser
      ) => responseAddUser.status === 201,
      "Mensagem da response de Cadastro de Usuário está correta": (
        responseAddUser
      ) => responseAddUser.json("message") === "User registered successfully",
    });
  });

  group("Login com credenciais válidas", function () {
    responseLoginUser = loginRequest(user.email, user.password);

    check(responseLoginUser, {
      "Status da response do Login do Usuário está igual a 200": (
        responseLoginUser
      ) => responseLoginUser.status === 200,
      "Mensagem da response do Login do Usuário está correto": (
        responseLoginUser
      ) => responseLoginUser.json("message") === "Login successful",
    });
  });

  group("Acessar a lista de produtos cadastrados", function () {
    const responseProductsList = http.get(PRODUCTS_URL, {
      headers: {
        Authorization: `Bearer ${responseLoginUser.json("data.token")}`,
        "Content-Type": "application/json",
      },
    });

    check(responseProductsList, {
      "Status da response da lista de produtos está igual a 200": (
        responseProductsList
      ) => responseProductsList.status === 200,
      "Mensagem da response da lista de produtos contem Laptop": (
        responseProductsList
      ) => responseProductsList.json().data[0].name === "Laptop",
    });
  });

  group("Realizar o checkout de um produto", function () {
    const checkoutPayload = {
      items: [
        {
          productId: 3,
          quantity: 1,
        },
      ],
      paymentMethod: "cash",
    };
    const responseCheckout = http.post(
      CHECKOUT_URL,
      JSON.stringify(checkoutPayload),
      {
        headers: {
          Authorization: `Bearer ${responseLoginUser.json("data.token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    check(responseCheckout, {
      "Status da response do Checkout está igual a 200": (responseCheckout) =>
        responseCheckout.status === 200,
      "Mensagem da response do Checkout está correta": (responseCheckout) =>
        responseCheckout.json("message") === "Checkout completed successfully",
      "Produto do checkout é Headphones": (responseCheckout) =>
        responseCheckout.json().data.items[0].productName === "Headphones",
      "Método de pagamento é cash": (responseCheckout) =>
        responseCheckout.json().data.paymentMethod === "cash",
      "Status do pedido é completed": (responseCheckout) =>
        responseCheckout.json().data.status === "completed",
    });

    postCheckoutDurationTrend.add(responseCheckout.timings.duration);
  });

  sleep(1);
}
