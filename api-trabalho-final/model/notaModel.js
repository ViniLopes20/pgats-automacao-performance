const { notas } = require('./db');

function addNota(nota) {
  notas.push(nota);
}

function findNotasByMatricula(matricula) {
  return notas.filter(n => n.matricula === matricula);
}

module.exports = {
  addNota,
  findNotasByMatricula
};
