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
