const notaModel = require('../model/notaModel');
const alunoModel = require('../model/alunoModel');

async function addNota({ matricula, nota }) {
  if (typeof nota !== 'number' || nota < 0) return { status: 400, message: 'Nota não pode ser menor que 0' };

  if (nota > 10) return { status: 400, message: 'Nota não pode ser maior que 10' };

  if (!alunoModel.findAlunoByMatricula(matricula)) return { status: 404, message: 'Aluno não encontrado' };

  notaModel.addNota({ matricula, nota });
  return { status: 201, message: 'Nota cadastrada com sucesso' };
}

module.exports = { addNota };
