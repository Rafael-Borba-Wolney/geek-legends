This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: node_modules, .git, .env, .env.*
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
controllers/
  carrinhoController.js
  categoriasController.js
  pedidoController.js
  produtosController.js
  usuariosController.js
database/
  db.js
  init_db.sql
middlewares/
  authMiddleware.js
models/
  carrinhoModel.js
  categoriasModel.js
  pedidoModel.js
  produtosModel.js
  usuariosModel.js
routes/
  carrinho.js
  categorias.js
  pedido.js
  produtos.js
  usuarios.js
services/
  authService.js
app.js
package.json
README.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="controllers/carrinhoController.js">
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
</file>

<file path="controllers/categoriasController.js">
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
</file>

<file path="controllers/pedidoController.js">
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
</file>

<file path="controllers/produtosController.js">
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
</file>

<file path="controllers/usuariosController.js">
import { criarUsuario, buscarPorEmail } from '../models/usuariosModel.js';
import { hashSenha, compararSenha, gerarToken } from '../services/authService.js';

export async function cadastrar(req, res) {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  // Verifica duplicidade de email
  const existente = await buscarPorEmail(email);
  if (existente) {
    return res.status(400).json({ erro: 'Email já cadastrado.' });
  }

  const senhaHash = await hashSenha(senha);
  const user = await criarUsuario(nome, email, senhaHash);
  res.status(201).json({ ...user });
}

export async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  }

  const user = await buscarPorEmail(email);
  if (!user) return res.status(401).json({ erro: 'Credenciais inválidas.' });

  const senhaOk = await compararSenha(senha, user.senha_hash);
  if (!senhaOk) return res.status(401).json({ erro: 'Credenciais inválidas.' });

  const token = gerarToken(user);
  res.json({
    usuario: { id: user.id, nome: user.nome, email: user.email, eh_admin: user.eh_admin },
    token
  });
}
</file>

<file path="database/db.js">
import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export const query = (text, params) => pool.query(text, params);
</file>

<file path="database/init_db.sql">
-- Banco: geek_legends

-- USUÁRIOS
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(200) NOT NULL,
  eh_admin BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIAS
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- PRODUTOS
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  imagem_url VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  categoria_id INT REFERENCES categorias(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CARRINHO
CREATE TABLE carrinhos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITENS DO CARRINHO
CREATE TABLE itens_carrinho (
  id SERIAL PRIMARY KEY,
  carrinho_id INT REFERENCES carrinhos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade INT NOT NULL CHECK(quantidade > 0)
);

-- PEDIDOS
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status VARCHAR(30) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITENS DO PEDIDO
CREATE TABLE itens_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade INT NOT NULL CHECK(quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0)
);
</file>

<file path="middlewares/authMiddleware.js">
import jwt from 'jsonwebtoken';

export function autenticarToken(req, res, next) {
    // Espera: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: 'Token inválido.' });
        req.usuario = usuario; // Adiciona os dados (id, email, ehAdmin) no req
        next();
    });
}

// Somente para administradores
export function somenteAdmin(req, res, next) {
    if (!req.usuario?.ehAdmin) {
        return res.status(403).json({ erro: 'Acesso restrito para administradores.' });
    }
    next();
}
</file>

<file path="models/carrinhoModel.js">
import { query } from '../database/db.js';

// Busca o carrinho do usuário, cria se não existir
export async function encontrarOuCriarCarrinho(usuarioId) {
  let result = await query('SELECT * FROM carrinhos WHERE usuario_id = $1', [usuarioId]);
  if (result.rows.length === 0) {
    result = await query('INSERT INTO carrinhos (usuario_id) VALUES ($1) RETURNING *', [usuarioId]);
  }
  return result.rows[0];
}

// Lista itens do carrinho do usuário (com dados dos produtos)
export async function listarItensCarrinho(carrinhoId) {
  const result = await query(`
    SELECT ic.id, ic.quantidade, p.id as produto_id, p.nome, p.preco, p.imagem_url, p.ativo
    FROM itens_carrinho ic
    JOIN produtos p ON ic.produto_id = p.id
    WHERE ic.carrinho_id = $1
  `, [carrinhoId]);
  return result.rows;
}

// Adiciona ou atualiza item no carrinho (upsert)
export async function adicionarOuAtualizarItem(carrinhoId, produtoId, quantidade = 1) {
  // Checa se já existe item
  const existe = await query(
    'SELECT * FROM itens_carrinho WHERE carrinho_id = $1 AND produto_id = $2',
    [carrinhoId, produtoId]
  );
  if (existe.rows.length > 0) {
    if (quantidade <= 0) {
      // Remove se quantidade <= 0
      await query(
        'DELETE FROM itens_carrinho WHERE carrinho_id=$1 AND produto_id=$2',
        [carrinhoId, produtoId]
      );
    } else {
      // Atualiza quantidade
      await query(
        'UPDATE itens_carrinho SET quantidade=$1 WHERE carrinho_id=$2 AND produto_id=$3',
        [quantidade, carrinhoId, produtoId]
      );
    }
  } else if (quantidade > 0) {
    // Adiciona novo item
    await query(`
      INSERT INTO itens_carrinho (carrinho_id, produto_id, quantidade)
      VALUES ($1, $2, $3)
    `, [carrinhoId, produtoId, quantidade]);
  }
}

// Remove completamente um produto do carrinho
export async function removerItem(carrinhoId, produtoId) {
  await query('DELETE FROM itens_carrinho WHERE carrinho_id=$1 AND produto_id=$2', [carrinhoId, produtoId]);
}
</file>

<file path="models/categoriasModel.js">
import { query } from '../database/db.js';

export async function criarCategoria(nome) {
  const result = await query('INSERT INTO categorias (nome) VALUES ($1) RETURNING *', [nome]);
  return result.rows[0];
}

export async function listarCategorias() {
  const result = await query('SELECT * FROM categorias ORDER BY nome');
  return result.rows;
}

export async function atualizarCategoria(id, nome) {
  const result = await query(
    'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
    [nome, id]
  );
  return result.rows[0];
}

export async function deletarCategoria(id) {
  await query('DELETE FROM categorias WHERE id = $1', [id]);
}
</file>

<file path="models/pedidoModel.js">
import { query } from '../database/db.js';

// Cria pedido para usuarioId, insere os itens, retorna o novo pedido
export async function criarPedido(usuarioId, itens) {
  // Soma total e salva pedido
  const total = itens.reduce((t, i) => t + i.preco * i.quantidade, 0);
  const pedidoResult = await query(
    `INSERT INTO pedidos (usuario_id, total, status) VALUES ($1, $2, 'pendente') RETURNING *`,
    [usuarioId, total]
  );
  const pedido = pedidoResult.rows[0];

  // Salva cada item
  for (const item of itens) {
    await query(
      `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
       VALUES ($1, $2, $3, $4)`,
      [pedido.id, item.produto_id, item.quantidade, item.preco]
    );
  }
  return pedido;
}

// Remove todos itens do carrinho
export async function limparCarrinho(carrinhoId) {
  await query(`DELETE FROM itens_carrinho WHERE carrinho_id=$1`, [carrinhoId]);
}

// Lista todos os pedidos deste usuário (se admin e sem filtro: retorna todos)
export async function listarPedidos(usuarioId, ehAdmin = false) {
  let sql = `
    SELECT p.*, u.nome as usuario_nome
    FROM pedidos p
    JOIN usuarios u ON u.id = p.usuario_id
  `;
  let params = [];
  if (!ehAdmin) {
    sql += ' WHERE usuario_id=$1';
    params = [usuarioId];
  }
  sql += ' ORDER BY p.criado_em DESC';
  const result = await query(sql, params);
  return result.rows;
}

// Detalha pedido + itens
export async function detalharPedido(pedidoId) {
  const resPedido = await query(
    `SELECT p.*, u.nome as usuario_nome, u.email
     FROM pedidos p
     JOIN usuarios u ON u.id = p.usuario_id
     WHERE p.id=$1`,
    [pedidoId]
  );
  if (resPedido.rows.length === 0) return null;
  const pedido = resPedido.rows[0];

  const resItens = await query(
    `SELECT ip.*, pr.nome, pr.imagem_url
     FROM itens_pedido ip
     JOIN produtos pr ON pr.id=ip.produto_id
     WHERE ip.pedido_id=$1`,
    [pedidoId]
  );
  pedido.itens = resItens.rows;
  return pedido;
}
</file>

<file path="models/produtosModel.js">
import { query } from '../database/db.js';

// Cria um produto novo
export async function criarProduto({ nome, descricao, preco, imagem_url, ativo = true, categoria_id }) {
  const result = await query(
    `INSERT INTO produtos (nome, descricao, preco, imagem_url, ativo, categoria_id)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [nome, descricao, preco, imagem_url, ativo, categoria_id]
  );
  return result.rows[0];
}

// Lista todos os produtos (opcional: só ativos)
export async function listarProdutos({ categoriaId = null, apenasAtivos = false } = {}) {
  let sql = `SELECT p.*, c.nome AS categoria_nome FROM produtos p LEFT JOIN categorias c ON c.id = p.categoria_id`;
  const params = [];
  if (categoriaId) {
    params.push(categoriaId);
    sql += ` WHERE p.categoria_id = $1`;
    if (apenasAtivos) {
      params.push(true);
      sql += ` AND p.ativo = $2`;
    }
  } else if (apenasAtivos) {
    params.push(true);
    sql += ` WHERE p.ativo = $1`;
  }
  sql += ` ORDER BY p.nome`;
  const result = await query(sql, params);
  return result.rows;
}

// Detalhe de um produto
export async function buscarProdutoPorId(id) {
  const result = await query(`SELECT * FROM produtos WHERE id = $1`, [id]);
  return result.rows[0];
}

// Atualizacao de produto
export async function atualizarProduto(id, dados) {
  const { nome, descricao, preco, imagem_url, ativo, categoria_id } = dados;
  const result = await query(
    `UPDATE produtos
     SET nome=$1, descricao=$2, preco=$3, imagem_url=$4, ativo=$5, categoria_id=$6, atualizado_em = NOW()
     WHERE id=$7 RETURNING *`,
    [nome, descricao, preco, imagem_url, ativo, categoria_id, id]
  );
  return result.rows[0];
}

// Deletar
export async function deletarProduto(id) {
  await query(`DELETE FROM produtos WHERE id = $1`, [id]);
}
</file>

<file path="models/usuariosModel.js">
import { query } from '../database/db.js';

export async function criarUsuario(nome, email, senhaHash, ehAdmin = false) {
  const result = await query(
    `INSERT INTO usuarios (nome, email, senha_hash, eh_admin) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, eh_admin, criado_em`,
    [nome, email, senhaHash, ehAdmin]
  );
  return result.rows[0];
}

export async function buscarPorEmail(email) {
  const result = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
}
</file>

<file path="routes/carrinho.js">
import { Router } from 'express';
import * as controller from '../controllers/carrinhoController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', autenticarToken, controller.verCarrinho);
router.post('/', autenticarToken, controller.adicionarOuAtualizar); // adicionar ou atualizar
router.delete('/', autenticarToken, controller.remover); // remover produto

export default router;
</file>

<file path="routes/categorias.js">
import { Router } from 'express';
import * as controller from '../controllers/categoriasController.js';
import { autenticarToken, somenteAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', controller.listar);
router.post('/', autenticarToken, somenteAdmin, controller.criar);
router.put('/:id', autenticarToken, somenteAdmin, controller.atualizar);
router.delete('/:id', autenticarToken, somenteAdmin, controller.deletar);

export default router;
</file>

<file path="routes/pedido.js">
import { Router } from 'express';
import * as controller from '../controllers/pedidoController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/checkout', autenticarToken, controller.checkout); // finalizar compra
router.get('/', autenticarToken, controller.listar);            // listar pedidos
router.get('/:id', autenticarToken, controller.detalhe);        // detalhes de um pedido

export default router;
</file>

<file path="routes/produtos.js">
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
</file>

<file path="routes/usuarios.js">
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
</file>

<file path="services/authService.js">
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT = 10;

export async function hashSenha(senha) {
  return bcrypt.hash(senha, SALT);
}

export async function compararSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}

export function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, ehAdmin: usuario.eh_admin },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}
</file>

<file path="app.js">
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import usuariosRoutes from './routes/usuarios.js';
import carrinhoRoutes from './routes/carrinho.js';
import pedidoRoutes from './routes/pedido.js';
import categoriasRoutes from './routes/categorias.js';
import produtosRoutes from './routes/produtos.js';

import { query } from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/produtos', produtosRoutes);

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
</file>

<file path="package.json">
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.21.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
</file>

<file path="README.md">
# Geek Legends – Backend

**Backend do e-commerce Geek Legends**, desenvolvido em Node.js + Express com PostgreSQL. Segue arquitetura REST API profissional, autenticação JWT, separação de responsabilidades e padrão seguro para sistemas reais.

## 📦 O que está implementado (até o momento)

- **Conexão segura com PostgreSQL** usando variáveis de ambiente (.env)
- **Arquitetura profissional** (separação em routes, controllers, models, services, middlewares)
- **Cadastro e Login de Usuários** (hash seguro de senha com bcrypt, autenticação JWT, usuários admin)
- **Proteção de rotas** via middleware personalizado usando JWT:  
  - Apenas usuários autenticados podem acessar partes protegidas
  - Apenas admins podem cadastrar/editar/deletar categorias e produtos
- **CRUD de Categorias** completo
- **CRUD de Produtos** completo, já com relação categoria/produto
- **Carrinho de compras persistente** (cada usuário tem seu carrinho, pode adicionar/remover produto/quantidade)
- **Checkout/Pedido**:
  - Usuário converte o carrinho em pedido
  - Itens do carrinho são transferidos para o pedido
  - Usuário pode listar seus próprios pedidos
  - Admin pode ver todos os pedidos

## 🧩 Tecnologias & boas práticas

- Node.js (ESModules)
- Express
- PostgreSQL (acesso via `pg`)
- Senhas com hash Bcrypt
- JWT para autenticação e autorização
- Arquitetura REST, código limpo e fácil de manter

## 🗂️ Estrutura de Pastas

```
backEnd/
├── app.js                # Entrada da aplicação Express
├── .env                  # Dados de acesso ao banco e segredo JWT (NUNCA subir para o Git)
├── database/             # Conexão ao PostgreSQL
├── routes/               # Todas as APIs REST
├── controllers/          # Lógica das rotas
├── models/               # Query ao banco / ORM
├── services/             # Regras de negócio (hash, JWT...)
├── middlewares/          # JWT, admin e afins
```

## 🔓 Como funciona o fluxo principal

1. **Usuário cadastra/login** (POST `/api/usuarios/cadastrar` e `/api/usuarios/login`)
2. **Admin cadastra categoria/produto**
3. **Usuário visualiza/filtra produtos**
4. **Usuário monta carrinho** (adiciona, remove, edita quantidades)
5. **Usuário finaliza pedido** (POST `/api/pedidos/checkout`)
6. **Usuário visualiza pedidos / admin vê tudo**

## 📋 Estado atual

> Até aqui, a API está pronta até a parte de autenticação, categorias, produtos, carrinho, e pedidos.
> Todas as funções essenciais de um e-commerce simples funcionam, com proteção avançada.

---

**Dúvidas ou quer validar? Só conferir as rotas no Insomnia/Postman!**

---
</file>

</files>
