import {
  criarCategoria,
  listarCategorias,
  atualizarCategoria,
  deletarCategoria,
} from '../models/categoriasModel.js';

export async function listar(req, res) {
  const categorias = await listarCategorias();
  res.json(categorias);
}

export async function criar(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
  const cat = await criarCategoria(nome);
  res.status(201).json(cat);
}

export async function atualizar(req, res) {
  const { nome } = req.body;
  const { id } = req.params;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
  const cat = await atualizarCategoria(id, nome);
  res.json(cat);
}

export async function deletar(req, res) {
  const { id } = req.params;
  await deletarCategoria(id);
  res.status(204).send(); // (no content)
}
