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
