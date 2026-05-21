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
