const alunoModel = require('../model/alunoModel');
const notaModel = require('../model/notaModel');

let matriculaSeq = 1;

async function register({ nome }) {
  if (!nome) return { status: 400, message: 'Nome é obrigatório' };

  const matricula = String(matriculaSeq++);
  alunoModel.addAluno({ matricula, nome });
  return { status: 201, message: 'Aluno cadastrado com sucesso', matricula };
}

async function listarAlunosComNotas() {
  const alunos = alunoModel.getAllAlunos();
  return alunos.map(aluno => ({
    matricula: aluno.matricula,
    nome: aluno.nome,
    notas: notaModel.findNotasByMatricula(aluno.matricula).map(n => n.nota)
  }));
}


module.exports = { register, listarAlunosComNotas };
