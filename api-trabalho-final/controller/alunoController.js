const alunoService = require('../service/alunoService');

async function register(req, res) {
  try {
    const result = await alunoService.register(req.body);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
}


async function listarAlunosComNotas(req, res) {
  try {
    const result = await alunoService.listarAlunosComNotas();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
}

module.exports = { register, listarAlunosComNotas };
