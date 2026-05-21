import { Router } from 'express';
import { cadastrar, login } from '../controllers/usuariosController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Cadastro e login continuam públicos
router.post('/cadastrar', cadastrar);
router.post('/login', login);

// EXEMPLO de rota protegida
router.get('/me', autenticarToken, (req, res) => {
  res.json({
    mensagem: 'Usuário autenticado!',
    usuario: req.usuario
  });
});

export default router;