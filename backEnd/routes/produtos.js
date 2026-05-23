import { Router } from 'express';
import * as controller from '../controllers/produtosController.js';
import { autenticarToken, somenteAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Público (lista e detalhe)
router.get('/', controller.listar);
router.get('/:id', controller.detalhes);

// Apenas ADMIN pode criar/editar/excluir
router.post('/', autenticarToken, somenteAdmin, controller.criar);
router.put('/:id', autenticarToken, somenteAdmin, controller.atualizar);
router.delete('/:id', autenticarToken, somenteAdmin, controller.deletar);

export default router;
