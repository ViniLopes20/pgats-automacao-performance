# Automação de Teste de Performance

## Instrução

Este repositório é focado em automação de testes de performance utilizando k6, incluindo uma API completa para cadastro de alunos, notas e usuários com autenticação JWT. Siga as instruções abaixo para instalar, configurar e rodar os testes e a API.

## Sumário

1. [Funcionalidades](#funcionalidades)
2. [Regras de Negócio](#regras-de-negócio)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Rotas Principais](#rotas-principais)
   - [Usuários](#usuários)
   - [Alunos](#alunos)
   - [Notas](#notas)
5. [Autenticação](#autenticação)
6. [Banco de Dados](#banco-de-dados)
7. [Configuração do Ambiente (.env)](#configuração-do-ambiente-env)
8. [Instalação e Execução](#instalação-e-execução)
9. [Testes de Performance com k6](#testes-de-performance-com-k6)
   - [Estrutura de tests/k6](#estrutura-de-testsk6)
   - [Como rodar um teste k6](#como-rodar-um-teste-k6)
10. [Recursos e Exemplos de Uso no k6](#recursos-e-exemplos-de-uso-no-k6)

    - [Thresholds](#thresholds)
    - [Checks](#checks)
    - [Helpers](#helpers)
    - [Trends](#trends)
    - [Faker](#faker)
    - [Variável de Ambiente](#variável-de-ambiente)
    - [Stages](#stages)
    - [Reaproveitamento de Resposta](#reaproveitamento-de-resposta)
    - [Uso de Token de Autenticação](#uso-de-token-de-autenticação)
    - [Data-Driven Testing](#data-driven-testing)
    - [Groups](#groups)
    - [Visualização dos Relatórios HTML](#visualização-dos-relatórios-html)

## Funcionalidades

- Registro de alunos (matrícula gerada automaticamente)
- Listagem de alunos com notas e matrícula
- Cadastro e listagem de usuários
- Login de usuário
- Cadastro de notas para alunos

## Regras de Negócio

1. Não pode inserir uma nota menor que 0.
2. Não pode inserir uma nota maior que 10.
3. Precisa estar autenticado via JWT (Bearer Token) para cadastrar/listar aluno, nota ou usuário.
4. Não pode adicionar uma nota para um aluno que não existe.
5. Não deve ser possível cadastrar dois alunos com o mesmo ID de matrícula (gerado automaticamente).
6. Não deve ser possível cadastrar usuários com o mesmo login.

## Estrutura do Projeto

- Banco de dados em memória (variáveis)
- Diretórios: `api-trabalho-final/controller`, `api-trabalho-final/service`, `api-trabalho-final/model`, `api-trabalho-final/middleware`, `tests/k6`
- Arquivos principais: `api-trabalho-final/app.js`, `api-trabalho-final/server.js`
- Documentação Swagger disponível em `/api-docs`

## Rotas Principais

### Usuários

- `POST /usuarios` — Cadastrar usuário `{ login, password }`
- `GET /usuarios` — Listar usuários (requer Bearer Token)
- `POST /login` — Login `{ login, password }` (retorna token JWT)

### Alunos

- `POST /alunos` — Cadastrar aluno `{ nome }` (requer Bearer Token, matrícula gerada automaticamente)
- `GET /alunos` — Listar alunos com notas e matrícula (requer Bearer Token)

### Notas

- `POST /notas` — Cadastrar nota `{ matricula, nota }` (requer Bearer Token)

## Autenticação

- JWT obrigatório para rotas protegidas.

## Banco de Dados

- Armazenamento em memória (os dados são perdidos ao reiniciar o servidor).

## Configuração do Ambiente (.env)

Antes de rodar as APIs ou os testes, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT_REST=
BASE_URL_REST=
```

Essas variáveis definem as portas dos servidores.

## Instalação e Execução

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   npm run start-api-trabalho-final
   ```
3. Acesse a documentação Swagger em: `http://localhost:${PORT_REST}/api-docs`

---

## Testes de Performance com k6

O projeto utiliza o [k6](https://k6.io/) para testes de performance, localizado em `tests/k6`.

### Estrutura de `tests/k6`

- `aluno.test.js` — Teste de performance para cadastro e listagem de alunos
- `login.test.js` — Teste de performance para login
- `helpers/` — Funções utilitárias para requisições (ex: login, aluno, baseURL)
- `data/usuarios.json` — Dados de usuários para testes data-driven
- `report/` — Relatórios HTML gerados pelos testes

### Como rodar um teste k6

Exemplo:

- Rodar e gerar um novo report `.html` na pasta `/report`

```bash
# Testes do aluno.test.js
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=100ms K6_WEB_DASHBOARD_EXPORT=./tests/k6/report/html-report-aluno.html k6 run ./tests/k6/aluno.test.js --env BASE_URL=http://localhost:2000

# Testes do login.test.js
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=100ms K6_WEB_DASHBOARD_EXPORT=./tests/k6/report/html-report-login.html k6 run ./tests/k6/login.test.js --env BASE_URL=http://localhost:2000
```

---

## Recursos e Exemplos de Uso no k6

### Thresholds

Thresholds (limiares) permitem definir critérios automáticos para aprovar ou reprovar o teste de performance, baseando-se em métricas como tempo de resposta, taxa de erro, etc. Se algum threshold for violado, o teste retorna código de erro ao final.

```js
// tests/k6/aluno.test.js, linha 14
export const options = {
  thresholds: {
    http_req_duration: ["p(95)<30"],
    post_aluno_duration: ["p(95)<30"],
    http_req_failed: ["rate<0.01"],
  },
};
```

### Checks

Checks utilizados para validar se o Status code da request está igual ao esperado, além disso, foi utilizado para validar as mensagens de sucesso retornado pela API e para verificar se presença do JWT token.

```js
// tests/k6/login.test.js, linha 31
check(responseLogin, {
  "Login status é 200": (responseLogin) => responseLogin.status === 200,
  "Login tem token JWT": (responseLogin) => !!responseLogin.json().token,
});

// tests/k6/aluno.test.js, linha 45
check(responseAddAluno, {
  "Request de add aluno está com o status 201": (responseAddAluno) =>
    responseAddAluno.status === 201,
  "Mensagem de aluno cadastrado está correta": (responseAddAluno) =>
    responseAddAluno.json("message") === "Aluno cadastrado com sucesso",
});
```

### Helpers

Helpers são funções utilitárias criadas para centralizar e reaproveitar lógicas comuns de requisições HTTP, autenticação e manipulação de dados nos scripts de teste. Isso facilita a manutenção, evita repetição de código e deixa os testes mais organizados e legíveis. Foi utilizado para fazer a abstração da lógica de request do Login (passando login e password), cadastro de Aluno (passando nome do aluno e JWT token) e listagem de Aluno (passando JWT token).

```js
// tests/k6/aluno.test.js, linha 6 e helpers/aluno.js, linha 4
import { addAluno, listAluno } from "./helpers/aluno.js";
// tests/k6/aluno.test.js, linha 3 e helpers/login.js, linha 4
import { login } from "./helpers/login.js";

// tests/k6/aluno.test.js, linha 31
const responseLogin = login(userData.login, userData.password);

// tests/k6/aluno.test.js, linha 41
const responseAddAluno = addAluno(alunoPayload.nome, token);

// tests/k6/aluno.test.js, linha 54
const responseListAluno = listAluno(token);
```

### Trends

Trends são métricas customizadas criadas para monitorar e analisar o tempo de execução de operações específicas durante o teste. Com elas, é possível acompanhar a evolução do tempo de resposta de uma determinada ação (ex: cadastro de aluno) ao longo do teste, além de gerar estatísticas detalhadas (média, percentis, máximo, mínimo) no relatório do k6.

```js
// tests/k6/aluno.test.js, linha 2 e 8
import { Trend } from "k6/metrics";
const postAlunoTrend = new Trend("post_aluno_duration");
// tests/k6/aluno.test.js, linha 43
postAlunoTrend.add(responseAddAluno.timings.duration);

// Resultado no terminal
CUSTOM
   post_aluno_duration............: avg=5.640471 min=0.315 med=3.366  max=67.815  p(90)=13.9333 p(95)=18.14145
```

### Faker

Faker foi utilizado para evitar precisar ficar criando um nome de Aluno para cada execução da request do POST. Dessa forma, o teste fica mais sólico, já que a biblioteca possibilita utilizar nomes mais reais e que dificilmente vai se repetir.

```js
// tests/k6/aluno.test.js, linha 5 e 38
import faker from "k6/x/faker";
const alunoPayload = {
  nome: faker.person.firstName() + " " + faker.person.lastName(),
};
```

### Variável de Ambiente

Permite passar a URL + Porta que a pessoa que está executando desejar, basta somente passar pelo terminal. Caso contrário, ele vai tentar utilizar o endereço da URL + Porta padrão.

```js
// tests/k6/helpers/baseURL.js, linha 1
export function baseURL() {
  return __ENV.BASE_URL || "http://localhost:2000";
}
```

Uso no comando:

```bash
k6 run script.js --env BASE_URL=http://localhost:2000
```

### Stages

Stages permitem simular o aumento (ramp-up) e a diminuição (ramp-down) progressiva do número de usuários virtuais durante o teste, tornando o cenário mais próximo do mundo real. Com eles, é possível avaliar como a aplicação se comporta sob diferentes cargas ao longo do tempo, identificando gargalos e pontos de instabilidade. Cada etapa define uma duração e um número alvo de usuários, facilitando a criação de cenários como picos de acesso, testes de estresse e estabilidade.

```js
// tests/k6/aluno.test.js, linha 14
export const options = {
  stages: [
    { duration: "3s", target: 10 },
    { duration: "15s", target: 50 },
    { duration: "5s", target: 100 },
    { duration: "10s", target: 50 },
    { duration: "5s", target: 0 },
  ],
};
```

### Reaproveitamento de Resposta

Foi reaproveitado a respota da request anterior para poder obter o JWT token para utilizar na próxima request e também foi utilizado essa abordagem para pegar a respota da request e utilizar nos `check`

```js
// tests/k6/aluno.test.js, linha 31 e 32
const responseLogin = login(userData.login, userData.password);
token = responseLogin.json().token;

// tests/k6/aluno.test.js, linha 41
const responseAddAluno = addAluno(alunoPayload.nome, token);

// tests/k6/aluno.test.js, linha 45
check(responseAddAluno, {
  "Request de add aluno está com o status 201": (responseAddAluno) =>
    responseAddAluno.status === 201,
  "Mensagem de aluno cadastrado está correta": (responseAddAluno) =>
    responseAddAluno.json("message") === "Aluno cadastrado com sucesso",
});
```

### Uso de Token de Autenticação

Foi utilizado o JWT token que foi obtido na request de Login para poder executar as request de POST e GET do `/alunos`.

```js
// tests/k6/helpers/aluno.js, linha 5
const url = `${baseURL()}/alunos`;
const payload = JSON.stringify({ nome });
const params = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

return http.post(url, payload, params);
```

### Data-Driven Testing

Foi utilizado para aproveitar os usuários que já estão cadastrados na base de dados da API para realizar o Login sem precisar ficar se preocupando com a criação de novos usuários. O arquivo `usuarios.json` contém as credenciais de dois usuários diferentes.

```js
// tests/k6/aluno.test.js, linha 4 e 10
import { SharedArray } from "k6/data";
const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/usuarios.json"));
});

// tests/k6/aluno.test.js, linha 26 e 31
const userData = users[(__VU - 1) % users.length];
const responseLogin = login(userData.login, userData.password);
```

### Groups

Organiza o teste em blocos lógicos:

```js
// tests/k6/login.test.js, linha 28
group("Login com credenciais válidas", function () {
  // ...
});
// tests/k6/aluno.test.js, linha 36
group("Cadastrar novo aluno", function () {
  // ...
});
```

### Visualização dos Relatórios HTML

Após rodar os testes, você pode visualizar os relatórios de performance gerados em HTML na pasta `tests/k6/report`:

- [html-report-aluno.html](tests/k6/report/html-report-aluno.html)
- [html-report-login.html](tests/k6/report/html-report-login.html)

Basta abrir o arquivo desejado no navegador para visualizar os resultados detalhados dos testes.
