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
