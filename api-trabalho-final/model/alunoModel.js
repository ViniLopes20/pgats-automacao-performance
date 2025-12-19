const { alunos } = require('./db');

function addAluno(aluno) {
  alunos.push(aluno);
}

function findAlunoByMatricula(matricula) {
  return alunos.find(a => a.matricula === matricula);
}


function getAllAlunos() {
  return alunos;
}

module.exports = {
  addAluno,
  findAlunoByMatricula,
  getAllAlunos
};
