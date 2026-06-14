import { usuarioLogado, obterUsuario, logout } from './auth.js';
import { atualizarNavbar, atualizarContadorCarrinho } from './ui.js';

const nomeSpan = document.getElementById('nome-usuario');
const emailSpan = document.getElementById('email-usuario');
const tipoSpan = document.getElementById('tipo-usuario');
const btnLogout = document.getElementById('btn-logout');

function carregarPerfil() {
  if (!usuarioLogado()) {
    window.location.href = 'login.html';
    const usuario = obterUsuario();
    console.log(usuario);
    return;
  }

  const usuario = obterUsuario();

  nomeSpan.textContent = usuario.nome;
  emailSpan.textContent = usuario.email;
  tipoSpan.textContent = usuario.eh_admin ? 'Administrador' : 'Usuário';
}

btnLogout.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja fazer logout?')) {
    logout();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  atualizarNavbar();
  atualizarContadorCarrinho();
  carregarPerfil();
});
