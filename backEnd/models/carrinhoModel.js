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
