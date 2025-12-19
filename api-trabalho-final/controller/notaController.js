const notaService = require('../service/notaService');

async function addNota(req, res) {
  try {
    const result = await notaService.addNota(req.body);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
}

module.exports = { addNota };
