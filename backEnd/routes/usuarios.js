import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ mensagem: "Rota de usuários funcionando!" });
});

export default router;
