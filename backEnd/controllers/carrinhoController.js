import {
  encontrarOuCriarCarrinho,
  listarItensCarrinho,
  adicionarOuAtualizarItem,
  removerItem
} from '../models/carrinhoModel.js';

// Listar o carrinho do usuário
export async function verCarrinho(req, res) {
  const usuarioId = req.usuario.id;
  const carrinho = await encontrarOuCriarCarrinho(usuarioId);
  const itens = await listarItensCarrinho(carrinho.id);
  const total = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  res.json({ itens, total });
}

// Adicionar/atualizar item
export async function adicionarOuAtualizar(req, res) {
  const usuarioId = req.usuario.id;
  const { produto_id, quantidade } = req.body;
  if (!produto_id || quantidade == null) {
    return res.status(400).json({ erro: 'produto_id e quantidade são obrigatórios' });
  }
  const carrinho = await encontrarOuCriarCarrinho(usuarioId);
  await adicionarOuAtualizarItem(carrinho.id, produto_id, quantidade);
  const itens = await listarItensCarrinho(carrinho.id);
  const total = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  res.json({ itens, total });
}

// Remover um produto (independente da quantidade)
export async function remover(req, res) {
  const usuarioId = req.usuario.id;
  const { produto_id } = req.body;
  if (!produto_id) return res.status(400).json({ erro: 'produto_id obrigatório' });
  const carrinho = await encontrarOuCriarCarrinho(usuarioId);
  await removerItem(carrinho.id, produto_id);
  const itens = await listarItensCarrinho(carrinho.id);
  const total = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  res.json({ itens, total });
}
