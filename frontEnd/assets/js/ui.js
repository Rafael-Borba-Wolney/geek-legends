import { usuarioLogado, logout, obterUsuario } from './auth.js';

// ========================================
// ATUALIZAR NAVBAR COM USUÁRIO LOGADO
// ========================================
export function atualizarNavbar() {
  const usuario = usuarioLogado();
  const navRight = document.querySelector('nav');

  if (!navRight) return;

  // Remove links de login antigos se existirem
  const loginLink = navRight.querySelector('a[href="login.html"]');

  if (usuario) {
    // Usuário está logado
    const userData = obterUsuario();

    if (loginLink) {
      loginLink.textContent = `👤 ${userData.nome}`;
      loginLink.href = '#';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // Usuário não está logado
    if (loginLink) {
      loginLink.textContent = 'Login';
      loginLink.href = 'login.html';
    }
  }
}

// ========================================
// PROTEGER ROTA (Redirecionar se não logado)
// ========================================
export function protegerRota(permitirSemLogin = false) {
  const usuario = usuarioLogado();

  if (!usuario && !permitirSemLogin) {
    alert('Você precisa estar logado para acessar essa página!');
    window.location.href = 'login.html';
  }
}

// ========================================
// INICIALIZAR UI GLOBAL
// ========================================
export function inicializarUI() {
  atualizarNavbar();
}

// Executar ao carregar a página
document.addEventListener('DOMContentLoaded', inicializarUI);
