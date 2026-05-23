import {
  criarPedido,
  limparCarrinho,
  listarPedidos,
  detalharPedido
} from '../models/pedidoModel.js';
import { encontrarOuCriarCarrinho, listarItensCarrinho } from '../models/carrinhoModel.js';

// Checkout: cria pedido, limpa carrinho
export async function checkout(req, res) {
  const usuarioId = req.usuario.id;

  const carrinho = await encontrarOuCriarCarrinho(usuarioId);
  const itens = await listarItensCarrinho(carrinho.id);

  if (!itens.length) return res.status(400).json({ erro: 'Carrinho vazio' });
  for (const item of itens) {
    if (!item.ativo) {
      return res.status(400).json({ erro: `Produto indisponível: ${item.nome}` });
    }
  }

  // Cria pedido e limpa carrinho
  const pedido = await criarPedido(usuarioId, itens.map(i => ({
    produto_id: i.produto_id,
    quantidade: i.quantidade,
    preco: i.preco
  })));
  await limparCarrinho(carrinho.id);
  res.status(201).json(pedido);
}

// Lista pedidos do usuário (ou todos se admin)
export async function listar(req, res) {
  const usuarioId = req.usuario.id;
  const ehAdmin = req.usuario.ehAdmin;
  const pedidos = await listarPedidos(usuarioId, ehAdmin);
  res.json(pedidos);
}

// Detalhar pedido
export async function detalhe(req, res) {
  const { id } = req.params;
  const pedido = await detalharPedido(id);
  if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

  // Usuário só pode ver seus pedidos, admin vê todos
  if (!req.usuario.ehAdmin && pedido.usuario_id !== req.usuario.id) {
    return res.status(403).json({ erro: 'Acesso restrito' });
  }
  res.json(pedido);
}
