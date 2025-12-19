const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const alunoController = require('./controller/alunoController');
const notaController = require('./controller/notaController');
const userController = require('./controller/userController');
const authenticate = require('./middleware/authenticate');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/login', userController.login);

app.post('/usuarios', userController.register);
app.get('/usuarios', authenticate, userController.listarUsuarios);

app.post('/alunos', authenticate, alunoController.register);
app.get('/alunos', authenticate, alunoController.listarAlunosComNotas);

app.post('/notas', authenticate, notaController.addNota);

module.exports = app;
