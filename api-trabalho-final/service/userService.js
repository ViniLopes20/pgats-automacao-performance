const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const SECRET = 'jwt_secret';

async function register({ login, password }) {
  if (!login || !password) return { status: 400, message: 'Login e senha são obrigatórios' };

  if (userModel.findUserByLogin(login)) return { status: 409, message: 'Usuário já cadastrado' };

  userModel.addUser({ login, password });
  return { status: 201, message: 'Usuário cadastrado com sucesso' };
}

async function login({ login, password }) {
  const user = userModel.findUserByLogin(login);
  if (!user || user.password !== password) return { status: 401, message: 'Credenciais inválidas' };

  const token = jwt.sign({ login }, SECRET, { expiresIn: '1h' });
  return { token };
}

async function listarUsuarios() {
  return userModel.getAllUsuarios();
}

module.exports = { register, login, listarUsuarios };
