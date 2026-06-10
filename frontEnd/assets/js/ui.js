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
// ATUALIZAR CONTADOR DO CARRINHO
// ========================================
export async function atualizarContadorCarrinho() {
  try {
    const usuario = usuarioLogado();

    const contador = document.getElementById('contador-carrinho');

    if (!contador) return;

    if (!usuario) {
      contador.textContent = '0';
      return;
    }

    const carrinho = await api.verCarrinhoAPI();
    contador.textContent = carrinho.itens.length;
  } catch (erro) {
    console.error('Erro ao atualizar contador:', erro);
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
