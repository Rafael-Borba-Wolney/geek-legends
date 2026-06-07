// ========================================
// CONFIGURAÇÃO E HELPERS DA API
// ========================================

// URL base do backend
const API_URL = 'http://localhost:3001/api';

// ========================================
// FUNÇÃO AUXILIAR: Requisição com JWT
// ========================================
async function requisicaoAPI(endpoint, opcoes = {}) {
  const url = `${API_URL}${endpoint}`;

  // Pega o token do localStorage
  const token = localStorage.getItem('token');

  // Configuração padrão
  const config = {
    method: opcoes.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers
    },
    ...opcoes
  };

  // Se tiver token, adiciona no cabeçalho
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const resposta = await fetch(url, config);
    const dados = await resposta.json();

    // Se error 401 (não autenticado), limpa token e redireciona
    if (resposta.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
      return;
    }

    // Se houver erro, lança exceção
    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro na requisição');
    }

    return dados;
  } catch (erro) {
    console.error('Erro na API:', erro);
    throw erro;
  }
}

// ========================================
// FUNÇÕES ESPECÍFICAS DA API
// ========================================

// USUÁRIOS
export async function loginAPI(email, senha) {
  return requisicaoAPI('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });
}

export async function cadastroAPI(nome, email, senha) {
  return requisicaoAPI('/usuarios/cadastrar', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha })
  });
}

// PRODUTOS
export async function listarProdutosAPI(categoriaId = null) {
  let url = '/produtos';
  if (categoriaId) url += `?categoriaId=${categoriaId}`;
  return requisicaoAPI(url);
}

export async function detalharProdutoAPI(id) {
  return requisicaoAPI(`/produtos/${id}`);
}

// CATEGORIAS
export async function listarCategoriasAPI() {
  return requisicaoAPI('/categorias');
}

// CARRINHO
export async function verCarrinhoAPI() {
  return requisicaoAPI('/carrinho');
}

export async function adicionarCarrinhoAPI(produtoId, quantidade) {
  return requisicaoAPI('/carrinho', {
    method: 'POST',
    body: JSON.stringify({ produto_id: produtoId, quantidade })
  });
}

export async function removerCarrinhoAPI(produtoId) {
  return requisicaoAPI('/carrinho', {
    method: 'DELETE',
    body: JSON.stringify({ produto_id: produtoId })
  });
}

// PEDIDOS
export async function checkoutAPI() {
  return requisicaoAPI('/pedidos/checkout', {
    method: 'POST'
  });
}

export async function listarPedidosAPI() {
  return requisicaoAPI('/pedidos');
}

export async function detalharPedidoAPI(id) {
  return requisicaoAPI(`/pedidos/${id}`);
}
