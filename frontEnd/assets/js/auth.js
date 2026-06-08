import * as api from './api.js';

// ========================================
// ELEMENTS DO DOM
// ========================================
const formLogin = document.getElementById('formLogin');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const linkCadastro = document.getElementById('linkCadastro');

// ========================================
// MODO: Detectar se é página de login ou cadastro
// ========================================
const ehPaginaCadastro = window.location.pathname.includes('cadastro');

// ========================================
// LOGIN
// ========================================
async function handleLogin(e) {
  e.preventDefault();

  const email = inputEmail.value.trim();
  const senha = inputSenha.value.trim();

  if (!email || !senha) {
    alert('Email e senha são obrigatórios!');
    return;
  }

  try {
    // Chama API de login
    const resposta = await api.loginAPI(email, senha);

    // Salva token e dados do usuário no localStorage
    localStorage.setItem('token', resposta.token);
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario));

    alert(`Bem-vindo, ${resposta.usuario.nome}!`);

    // Redireciona para página de produtos
    window.location.href = 'produtos.html';
  } catch (erro) {
    alert(`Erro no login: ${erro.message}`);
  }
}

// ========================================
// CADASTRO
// ========================================
async function handleCadastro(e) {
  e.preventDefault();

  const nome = document.getElementById('nome')?.value.trim();
  const email = inputEmail.value.trim();
  const senha = inputSenha.value.trim();

  if (!nome || !email || !senha) {
    alert('Nome, email e senha são obrigatórios!');
    return;
  }

  if (senha.length < 6) {
    alert('Senha precisa ter pelo menos 6 caracteres!');
    return;
  }

  try {
    // Chama API de cadastro
    const resposta = await api.cadastroAPI(nome, email, senha);

    alert('Cadastro realizado com sucesso! Faça login para continuar.');

    // Limpa form e volta para login
    formLogin.reset();

    // Redireciona para login (ou deixa na mesma página)
    window.location.href = 'login.html';
  } catch (erro) {
    alert(`Erro no cadastro: ${erro.message}`);
  }
}

// ========================================
// SETUP DE EVENTOS
// ========================================
if (formLogin) {
  formLogin.addEventListener('submit', ehPaginaCadastro ? handleCadastro : handleLogin);
}

if (linkCadastro) {
  linkCadastro.addEventListener('click', (e) => {
    e.preventDefault();
    // Redireciona para página de cadastro (vamos criar em breve)
    window.location.href = 'cadastro.html';
  });
}

// ========================================
// FUNÇÃO PARA FAZER LOGOUT
// ========================================
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  alert('Você foi desconectado!');
  window.location.href = 'login.html';
}

// ========================================
// VERIFICAR SE USUÁRIO ESTÁ LOGADO
// ========================================
export function usuarioLogado() {
  return localStorage.getItem('usuario');
}

export function obterUsuario() {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
}
