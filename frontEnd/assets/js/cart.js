import * as api from './api.js';
import { protegerRota } from './ui.js';
import { usuarioLogado } from './auth.js';// ========================================

// ELEMENTOS DO DOM
// ========================================
const containerCarrinho = document.querySelector('.carrinho-vazio');
const containerItens = document.getElementById('container-itens-carrinho');
const botaoFinalizar = document.getElementById('btn-finalizar-compra');
const totalCarrinho = document.getElementById('total-carrinho');

// ========================================
// PROTEGER ROTA (usuário deve estar logado)
// ========================================
function verificarAutenticacao() {
  if (!usuarioLogado()) {
    alert('Você precisa estar logado para acessar o carrinho!');
    window.location.href = 'login.html';
  }
}

// ========================================
// CARREGAR E EXIBIR CARRINHO
// ========================================
async function carregarCarrinho() {
  try {
    const carrinho = await api.verCarrinhoAPI();

    if (carrinho.itens.length === 0) {
      mostrarCarrinhoVazio();
      return;
    }

    renderizarItensCarrinho(carrinho.itens, carrinho.total);
    atualizarTotalCarrinho(carrinho.total);
  } catch (erro) {
    console.error('Erro ao carregar carrinho:', erro);
    alert('Erro ao carregar carrinho');
  }
}

// ========================================
// MOSTRAR CARRINHO VAZIO
// ========================================
function mostrarCarrinhoVazio() {
  if (containerCarrinho) {
    containerCarrinho.style.display = 'block';
  }
  if (containerItens) {
    containerItens.style.display = 'none';
  }
  if (botaoFinalizar) {
    botaoFinalizar.style.display = 'none';
  }
}

// ========================================
// RENDERIZAR ITENS DO CARRINHO
// ========================================
function renderizarItensCarrinho(itens, total) {
  // Mostra container de itens, esconde carrinho vazio
  if (containerCarrinho) {
    containerCarrinho.style.display = 'none';
  }
  if (containerItens) {
    containerItens.style.display = 'block';
  }
  if (botaoFinalizar) {
    botaoFinalizar.style.display = 'block';
  }

  // Limpa container
  containerItens.innerHTML = '';

  // Cria tabela/lista de itens
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.color = 'white';

  // Header
  const header = document.createElement('thead');
  header.innerHTML = `
    <tr style="border-bottom: 1px solid #31205c; text-align: left;">
      <th style="padding: 15px;">Produto</th>
      <th style="padding: 15px;">Preço</th>
      <th style="padding: 15px;">Quantidade</th>
      <th style="padding: 15px;">Subtotal</th>
      <th style="padding: 15px;">Ação</th>
    </tr>
  `;
  table.appendChild(header);

  // Body com itens
  const body = document.createElement('tbody');
  itens.forEach((item) => {
    const subtotal = Number(item.preco) * item.quantidade;
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #1e293b';
    tr.innerHTML = `
      <td style="padding: 15px;">
        <img src="${item.imagem_url}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 10px; vertical-align: middle;">
        <span>${item.nome}</span>
      </td>
<td style="padding: 15px;">R$ ${Number(item.preco).toFixed(2)}</td>
      <td style="padding: 15px;">
        <input type="number" min="1" value="${item.quantidade}" data-produto-id="${item.produto_id}" class="input-quantidade" style="width: 50px; padding: 5px; background-color: #1e293b; border: 1px solid #31205c; border-radius: 4px; color: white;">
      </td>
      <td style="padding: 15px; color: #00d4ff; font-weight: bold;">R$ ${subtotal.toFixed(2)}</td>
      <td style="padding: 15px;">
        <button class="btn-remover" data-produto-id="${item.produto_id}" style="background-color: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
          🗑️ Remover
        </button>
      </td>
    </tr>
  `;
    body.appendChild(tr);
  });
  table.appendChild(body);

  containerItens.appendChild(table);

  const secaoCheckout = document.getElementById('secao-checkout');
  if (secaoCheckout) {
    secaoCheckout.classList.add('mostrado');
  }
  // Adiciona listeners aos botões
  adicionarListenersAtualizacao();
}

// ========================================
// ATUALIZAR QUANTIDADE DO ITEM
// ========================================
async function atualizarQuantidade(produtoId, novaQuantidade) {
  if (novaQuantidade <= 0) {
    removerDoCarrinho(produtoId);
    return;
  }

  try {
    const carrinho = await api.adicionarCarrinhoAPI(produtoId, novaQuantidade);
    await carregarCarrinho(); // Recarrega a página
    atualizarContadorCarrinho();
  } catch (erro) {
    alert(`Erro ao atualizar quantidade: ${erro.message}`);
  }
}

// ========================================
// REMOVER DO CARRINHO
// ========================================
async function removerDoCarrinho(produtoId) {
  try {
    await api.removerCarrinhoAPI(produtoId);
    alert('Produto removido do carrinho!');
    await carregarCarrinho();
    atualizarContadorCarrinho();
  } catch (erro) {
    alert(`Erro ao remover: ${erro.message}`);
  }
}

// ========================================
// ADICIONAR LISTENERS
// ========================================
function adicionarListenersAtualizacao() {
  // Inputs de quantidade
  document.querySelectorAll('.input-quantidade').forEach((input) => {
    input.addEventListener('change', async (e) => {
      const produtoId = parseInt(e.target.getAttribute('data-produto-id'));
      const novaQtd = parseInt(e.target.value);
      await atualizarQuantidade(produtoId, novaQtd);
    });
  });

  // Botões de remover
  document.querySelectorAll('.btn-remover').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const produtoId = parseInt(e.target.getAttribute('data-produto-id'));
      if (confirm('Remover este produto do carrinho?')) {
        await removerDoCarrinho(produtoId);
      }
    });
  });
}

// ========================================
// ATUALIZAR TOTAL NA TELA
// ========================================
function atualizarTotalCarrinho(total) {
  if (totalCarrinho) {
    totalCarrinho.textContent = `R$ ${Number(total).toFixed(2)}`;
  }
}

// ========================================
// FINALIZAR COMPRA (CHECKOUT)
// ========================================
async function finalizarCompra() {
  if (!confirm('Tem certeza que deseja finalizar a compra?')) {
    return;
  }

  try {
    const pedido = await api.checkoutAPI();
    alert(`Pedido #${pedido.id} realizado com sucesso! Total: R$ ${pedido.total.toFixed(2)}`);

    // Redireciona para página de sucesso ou produtos
    setTimeout(() => {
      window.location.href = 'pedidos.html';
    }, 1500);
  } catch (erro) {
    alert(`Erro ao finalizar compra: ${erro.message}`);
  }
}

// ========================================
// ATUALIZAR CONTADOR NA NAVBAR
// ========================================
async function atualizarContadorCarrinho() {
  try {
    const carrinho = await api.verCarrinhoAPI();
    const contador = document.getElementById('contador-carrinho');
    if (contador) {
      contador.textContent = carrinho.itens.length;
    }
  } catch (erro) {
    console.error('Erro ao atualizar contador:', erro);
  }
}

// ========================================
// SETUP DO BOTÃO FINALIZAR
// ========================================
if (botaoFinalizar) {
  botaoFinalizar.addEventListener('click', finalizarCompra);
}

// ========================================
// INICIALIZAR
// ========================================
function inicializar() {
  verificarAutenticacao();
  carregarCarrinho();
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', inicializar);
