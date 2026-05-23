import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  deletarProduto
} from '../models/produtosModel.js';

export async function listar(req, res) {
  // Filtros opcionais: categoriaId, apenasAtivos
  const { categoriaId, apenasAtivos } = req.query;
  const produtos = await listarProdutos({
    categoriaId: categoriaId ? Number(categoriaId) : null,
    apenasAtivos: apenasAtivos === 'true'
  });
  res.json(produtos);
}

export async function detalhes(req, res) {
  const { id } = req.params;
  const produto = await buscarProdutoPorId(id);
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
}

export async function criar(req, res) {
  const { nome, descricao, preco, imagem_url, ativo = true, categoria_id } = req.body;
  if (!nome || !descricao || !preco || !categoria_id) {
    return res.status(400).json({ erro: 'Informe nome, descrição, preço e categoria_id' });
  }
  const produto = await criarProduto({ nome, descricao, preco, imagem_url, ativo, categoria_id });
  res.status(201).json(produto);
}

export async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, descricao, preco, imagem_url, ativo, categoria_id } = req.body;
  const produto = await atualizarProduto(id, { nome, descricao, preco, imagem_url, ativo, categoria_id });
  res.json(produto);
}

export async function deletar(req, res) {
  const { id } = req.params;
  await deletarProduto(id);
  res.status(204).send();
}
