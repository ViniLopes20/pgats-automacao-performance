const jwt = require('jsonwebtoken');
const SECRET = 'jwt_secret';

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
