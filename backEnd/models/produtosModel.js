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
