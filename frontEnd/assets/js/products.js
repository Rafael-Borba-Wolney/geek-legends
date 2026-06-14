import * as api from './api.js';
import { protegerRota, atualizarContadorCarrinho } from './ui.js';
import { atualizarContadorCarrinho } from './ui.js';
// ========================================
// ELEMENTOS DO DOM
// ========================================
const cardsContainer = document.querySelector('.cards-produtos');
const inputBusca = document.querySelector('.buscar-produto');
const filtrosUl = document.querySelector('.filtros ul');
const resultadoSpan = document.querySelector('.resultado span');

// ========================================
// ESTADO
// ========================================
let produtosGlobal = [];
let categoriasGlobal = [];
let categoriaAtual = null;

// ========================================
// CARREGAR CATEGORIAS DA API
// ========================================
async function carregarCategorias() {
  try {
    categoriasGlobal = await api.listarCategoriasAPI();
    renderizarFiltros();
  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
  }
}

// ========================================
// RENDERIZAR FILTROS COM CATEGORIAS REAIS
// ========================================
function renderizarFiltros() {
  // Limpa filtros antigos
  filtrosUl.innerHTML = '';

  // Adiciona "Todos os Produtos"
  const liTodos = document.createElement('li');
  liTodos.textContent = 'Todos os Produtos';
  liTodos.classList.add('selecionado');
  liTodos.addEventListener('click', () => filtrarPorCategoria(null));
  filtrosUl.appendChild(liTodos);

  // Adiciona categorias do banco
  categoriasGlobal.forEach((cat) => {
    const li = document.createElement('li');
    li.textContent = cat.nome;
    li.addEventListener('click', () => filtrarPorCategoria(cat.id, cat.nome));
    filtrosUl.appendChild(li);
  });
}

// ========================================
// CARREGAR PRODUTOS DA API
// ========================================
async function carregarProdutos(categoriaId = null) {
  try {
    produtosGlobal = await api.listarProdutosAPI(categoriaId);
    renderizarProdutos(produtosGlobal);
    atualizarResultado(produtosGlobal.length);
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    cardsContainer.innerHTML = '<p style="color: red;">Erro ao carregar produtos</p>';
  }
}

// ========================================
// RENDERIZAR CARDS DE PRODUTOS
// ========================================
function renderizarProdutos(produtos) {
  cardsContainer.innerHTML = '';

  if (produtos.length === 0) {
    cardsContainer.innerHTML = '<p style="color: #b6c2d9;">Nenhum produto encontrado</p>';
    return;
  }

  produtos.forEach((produto) => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
<img src="${produto.imagem_url || ''}" alt="${produto.nome}" onerror="this.style.display='none'">
      <div class="info-produto">
        <h4>${produto.nome}</h4>
        <p>${produto.descricao}</p>
        <div class="preco-botao">
<strong>R$ ${Number(produto.preco).toFixed(2)}</strong>
          <button class="btn-carrinho" data-produto-id="${produto.id}" data-produto-nome="${produto.nome}">
            🛒
          </button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  // Adiciona listeners aos botões de carrinho
  adicionarListenersCarrinho();
}

// ========================================
// FILTRAR POR CATEGORIA
// ========================================
async function filtrarPorCategoria(categoriaId, categoriaNome) {
  categoriaAtual = categoriaId;

  // Atualiza visual do filtro
  document.querySelectorAll('.filtros li').forEach((li) => {
    li.classList.remove('selecionado');
  });
  event.target.classList.add('selecionado');

  // Limpa busca
  if (inputBusca) inputBusca.value = '';

  // Carrega produtos da categoria
  await carregarProdutos(categoriaId);
}

// ========================================
// BUSCAR PRODUTOS (LOCAL)
// ========================================
function buscarProdutos(termo) {
  const termoLower = termo.toLowerCase();
  const produtosFiltrados = produtosGlobal.filter((prod) =>
    prod.nome.toLowerCase().includes(termoLower) ||
    prod.descricao.toLowerCase().includes(termoLower)
  );
  renderizarProdutos(produtosFiltrados);
  atualizarResultado(produtosFiltrados.length);
}

// ========================================
// ATUALIZAR RESULTADO
// ========================================
function atualizarResultado(quantidade) {
  if (resultadoSpan) resultadoSpan.textContent = quantidade;
}

// ========================================
// ADICIONAR AO CARRINHO
// ========================================
async function adicionarListenersCarrinho() {
  const botoesCarrinho = document.querySelectorAll('.btn-carrinho');

  botoesCarrinho.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      // Verifica se está logado
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para adicionar ao carrinho!');
        window.location.href = 'login.html';
        return;
      }

      const produtoId = btn.getAttribute('data-produto-id');
      const produtoNome = btn.getAttribute('data-produto-nome');

      try {
        await api.adicionarCarrinhoAPI(parseInt(produtoId), 1);
        await atualizarContadorCarrinho();
        alert(`${produtoNome} adicionado ao carrinho!`);
        // atualizarContadorCarrinho();
      } catch (erro) {
        alert(`Erro: ${erro.message}`);
      }
    });
  });
}
//
// // ========================================
// // ATUALIZAR CONTADOR DO CARRINHO NA NAVBAR
// // ========================================
// async function atualizarContadorCarrinho() {
//   try {
//     const carrinho = await api.verCarrinhoAPI();
//     const contador = document.getElementById('contador-carrinho');
//     if (contador) {
//       contador.textContent = carrinho.itens.length;
//     }
//   } catch (erro) {
//     console.error('Erro ao atualizar carrinho:', erro);
//   }
// }

// ========================================
// BUSCA EM TEMPO REAL
// ========================================
if (inputBusca) {
  inputBusca.addEventListener('input', (e) => {
    buscarProdutos(e.target.value);
  });
}

// ========================================
// INICIALIZAR
// ========================================
async function inicializar() {
  console.log('Carregando produtos...');
  await carregarCategorias();
  await carregarProdutos();
  await atualizarContadorCarrinho();
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', inicializar);
