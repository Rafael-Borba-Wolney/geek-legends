import * as api from './api.js';
import { atualizarContadorCarrinho } from './ui.js';
import { usuarioLogado } from './auth.js';

// ========================================
// ELEMENTOS DO DOM
// ========================================
const containerCarrinho = document.querySelector('.carrinho-vazio');
const containerItens = document.getElementById('container-itens-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');

// ========================================
// PROTEGER ROTA
// ========================================
function verificarAutenticacao() {
  if (!usuarioLogado()) {
    alert('Você precisa estar logado para acessar o carrinho!');
    window.location.href = 'login.html';
  }
}

// ========================================
// CARREGAR CARRINHO
// ========================================
async function carregarCarrinho() {
  try {
    const carrinho = await api.verCarrinhoAPI();

    if (!carrinho.itens || carrinho.itens.length === 0) {
      alert('Seu carrinho está vazio!');
      window.location.href = 'produtos.html';
      return;
    }

    renderizarItensCarrinho(carrinho.itens);
    atualizarTotalCarrinho(carrinho.total);

  } catch (erro) {
    console.error('Erro ao carregar carrinho:', erro);
    alert('Erro ao carregar carrinho');
  }
}

// ========================================
// RENDERIZAR ITENS
// ========================================
function renderizarItensCarrinho(itens) {

  if (containerCarrinho) {
    containerCarrinho.style.display = 'none';
  }

  if (containerItens) {
    containerItens.style.display = 'block';
  }

  containerItens.innerHTML = `
    <h2 style="margin-bottom: 30px;">Seu Carrinho</h2>
  `;

  const table = document.createElement('table');

  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.color = 'white';

  table.innerHTML = `
    <thead>
      <tr style="border-bottom: 1px solid #31205c; text-align: left;">
        <th style="padding: 15px;">Produto</th>
        <th style="padding: 15px;">Preço</th>
        <th style="padding: 15px;">Quantidade</th>
        <th style="padding: 15px;">Subtotal</th>
        <th style="padding: 15px;">Ação</th>
      </tr>
    </thead>
  `;

  const body = document.createElement('tbody');

  itens.forEach((item) => {

    const subtotal = Number(item.preco) * item.quantidade;

    const tr = document.createElement('tr');

    tr.style.borderBottom = '1px solid #1e293b';

    tr.innerHTML = `
      <td style="padding: 15px;">
        ${item.imagem_url ? `
          <img 
            src="${item.imagem_url}" 
            alt="${item.nome}" 
            style="
              width: 60px;
              height: 60px;
              object-fit: cover;
              border-radius: 5px;
              margin-right: 10px;
              vertical-align: middle;
            ">
        ` : ''}

        <span>${item.nome}</span>
      </td>

      <td style="padding: 15px;">
        R$ ${Number(item.preco).toFixed(2)}
      </td>

      <td style="padding: 15px;">
        <input
          type="number"
          min="1"
          value="${item.quantidade}"
          data-produto-id="${item.produto_id}"
          class="input-quantidade"
          style="
            width: 50px;
            padding: 5px;
            background-color: #1e293b;
            border: 1px solid #31205c;
            border-radius: 4px;
            color: white;
          "
        >
      </td>

      <td style="padding: 15px; color: #00d4ff; font-weight: bold;">
        R$ ${subtotal.toFixed(2)}
      </td>

      <td style="padding: 15px;">
        <button
          class="btn-remover"
          data-produto-id="${item.produto_id}"
          style="
            background-color: #dc2626;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
          "
        >
          🗑️ Remover
        </button>
      </td>
    `;

    body.appendChild(tr);
  });

  table.appendChild(body);

  containerItens.appendChild(table);

  adicionarListenersAtualizacao();
}

// ========================================
// ATUALIZAR QUANTIDADE
// ========================================
async function atualizarQuantidade(produtoId, novaQuantidade) {

  if (novaQuantidade <= 0) {
    await removerDoCarrinho(produtoId);
    return;
  }

  try {

    await api.adicionarCarrinhoAPI(produtoId, novaQuantidade);

    await carregarCarrinho();

    atualizarContadorCarrinho();

  } catch (erro) {

    alert(`Erro ao atualizar quantidade: ${erro.message}`);
  }
}

// ========================================
// REMOVER ITEM
// ========================================
async function removerDoCarrinho(produtoId) {

  try {

    await api.removerCarrinhoAPI(produtoId);

    await carregarCarrinho();

    atualizarContadorCarrinho();

  } catch (erro) {

    alert(`Erro ao remover: ${erro.message}`);
  }
}

// ========================================
// LISTENERS
// ========================================
function adicionarListenersAtualizacao() {

  document.querySelectorAll('.input-quantidade').forEach((input) => {

    input.addEventListener('change', async (e) => {

      const produtoId = parseInt(
        e.target.getAttribute('data-produto-id')
      );

      const novaQtd = parseInt(e.target.value);

      await atualizarQuantidade(produtoId, novaQtd);
    });
  });

  document.querySelectorAll('.btn-remover').forEach((btn) => {

    btn.addEventListener('click', async (e) => {

      const produtoId = parseInt(
        e.target.getAttribute('data-produto-id')
      );

      if (confirm('Remover este produto do carrinho?')) {

        await removerDoCarrinho(produtoId);
      }
    });
  });
}

// ========================================
// TOTAL
// ========================================
function atualizarTotalCarrinho(total) {

  if (totalCarrinho) {
    totalCarrinho.textContent =
      `R$ ${Number(total).toFixed(2)}`;
  }
}

// ========================================
// FINALIZAR COMPRA
// ========================================
async function finalizarCompra() {

  if (!confirm('Tem certeza que deseja finalizar a compra?')) {
    return;
  }

  try {

    const pedido = await api.checkoutAPI();

    alert(
      `Pedido #${pedido.id} realizado com sucesso! Total: R$ ${Number(pedido.total).toFixed(2)}`
    );

    window.location.href = 'pedidos.html';

  } catch (erro) {

    alert(`Erro ao finalizar compra: ${erro.message}`);
  }
}

// ========================================
// INICIALIZAR
// ========================================
function inicializar() {

  verificarAutenticacao();

  const botao = document.getElementById('btn-finalizar-compra');

  if (botao) {
    botao.addEventListener('click', finalizarCompra);
  }

  carregarCarrinho();
}

document.addEventListener('DOMContentLoaded', inicializar);
