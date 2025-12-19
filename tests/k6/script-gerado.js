import http from "k6/http";
import { sleep, check } from "k6";
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";

export const options = {
  vus: 10,
  interactions: 1,
  duration: "30s",
};

export default function () {
  let res = http.get("https://quickpizza.grafana.com");

  check(res, {
    "status is 200": (res) => res.status === 200,
    "status text is 200 OK": (res) => res.status_text === "200 OK",
  });

  expect.soft(res.status).toBe(200);
  expect.soft(res.status_text).toBe("200 OK");

  sleep(1);
}
