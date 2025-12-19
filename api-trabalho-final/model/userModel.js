const { usuarios } = require('./db');

function addUser(user) {
  usuarios.push(user);
}

function findUserByLogin(login) {
  return usuarios.find(u => u.login === login);
}

function getAllUsuarios() {
  return usuarios.map(u => ({ login: u.login }));
}

module.exports = {
  addUser,
  findUserByLogin,
  getAllUsuarios
};
