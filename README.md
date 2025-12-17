# API Progressão de Alunos de Música

## Descrição
API Rest para acompanhamento da progressão de alunos de música. Permite registro e autenticação de instrutores e alunos, cadastro de lições, registro de progresso e consulta de progresso dos alunos.

## Funcionalidades
- Registro e login de instrutor
- Registro e login de aluno
- Cadastro de lições
- Registro de lições realizadas pelo aluno
- Consulta de progresso do aluno
- Autenticação via JWT
- Documentação Swagger

## Estrutura do Projeto
- `routes/` - Rotas da API
- `controllers/` - Lógica de controle das rotas
- `service/` - Regras de negócio e manipulação dos dados
- `model/` - Modelos de dados
- `resources/` - Documentação Swagger
- `middleware/` - Middleware de autenticação

## Banco de Dados
- Utiliza armazenamento em memória (não persiste dados após reiniciar o servidor)

## Autenticação
- Instrutores: acesso total às funcionalidades
- Alunos: acesso apenas à consulta de progresso
- Autenticação via JWT, middleware controla acesso por tipo de usuário

## Documentação Swagger
- Disponível em `/swagger` após iniciar o servidor

## Como executar
1. Instale as dependências:
   ```bash
   npm install express jsonwebtoken swagger-ui-express js-yaml
   ```
2. Inicie o servidor:
   ```bash
   node app.js
   ```
3. Acesse a documentação Swagger em [http://localhost:3000/swagger](http://localhost:3000/swagger)

## Endpoints principais
Consulte o arquivo `resources/swagger.yaml` para detalhes dos endpoints e modelos de dados.

## Observações
- Este projeto é apenas para fins de demonstração e não deve ser usado em produção sem persistência de dados e segurança adequada.
