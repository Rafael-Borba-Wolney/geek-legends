import { Router } from 'express';
import * as controller from '../controllers/pedidoController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/checkout', autenticarToken, controller.checkout); // finalizar compra
router.get('/', autenticarToken, controller.listar);            // listar pedidos
router.get('/:id', autenticarToken, controller.detalhe);        // detalhes de um pedido

export default router;
