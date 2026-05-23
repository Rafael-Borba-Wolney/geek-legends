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
