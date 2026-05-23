import { Router } from 'express';
import * as controller from '../controllers/carrinhoController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', autenticarToken, controller.verCarrinho);
router.post('/', autenticarToken, controller.adicionarOuAtualizar); // adicionar ou atualizar
router.delete('/', autenticarToken, controller.remover); // remover produto

export default router;
