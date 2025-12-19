require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT_REST || 2000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
