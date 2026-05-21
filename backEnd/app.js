import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import usuariosRoutes from './routes/usuarios.js';
import db from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/usuarios', usuariosRoutes);

// Endpoint de teste de conexão com banco
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ status: 'erro' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
