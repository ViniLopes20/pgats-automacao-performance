const userService = require('../service/userService');

async function register(req, res) {
  try {
    const result = await userService.register(req.body);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
}

async function login(req, res) {
  try {
    const result = await userService.login(req.body);
    if (result.token) return res.json({ token: result.token });

    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
}

async function listarUsuarios(req, res) {
  try {
    const result = await userService.listarUsuarios();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
}

module.exports = { register, login, listarUsuarios };
