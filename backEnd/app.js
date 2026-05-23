import dotenv from 'dotenv';
dotenv.config(); // Precisa chamar antes de usar process.env

import express from 'express';
import cors from 'cors';

import usuariosRoutes from './routes/usuarios.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);

import { query } from './database/db.js';
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ status: 'erro' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
