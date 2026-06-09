import * as api from './api.js';
import { usuarioLogado } from './ui.js';

const containerPedidos = document.getElementById('container-pedidos');

async function carregarPedidos() {
  if (!usuarioLogado()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const pedidos = await api.listarPedidosAPI();

    if (pedidos.length === 0) {
      containerPedidos.innerHTML = '<p style="color: #b6c2d9;">Você não tem pedidos ainda.</p>';
      return;
    }

    containerPedidos.innerHTML = '';
    pedidos.forEach((pedido) => {
      const card = document.createElement('div');
      card.style.cssText = `
        background-color: #0f172a;
        border: 1px solid #31205c;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
      `;
      card.innerHTML = `
        <h3>Pedido #${pedido.id}</h3>
        <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
        <p><strong>Status:</strong> <span style="color: #00d4ff;">${pedido.status}</span></p>
        <p><strong>Data:</strong> ${new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</p>
        <button onclick="verDetalhesPedido(${pedido.id})" style="
          background: linear-gradient(90deg, #00d4ff, #9b2cff);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        ">
          Ver Detalhes
        </button>
      `;
      containerPedidos.appendChild(card);
    });
  } catch (erro) {
    alert(`Erro ao carregar pedidos: ${erro.message}`);
  }
}

window.verDetalhesPedido = async (id) => {
  try {
    const pedido = await api.detalharPedidoAPI(id);
    let detalhes = `Pedido #${pedido.id}\nTotal: R$ ${pedido.total.toFixed(2)}\n\nItens:\n`;
    pedido.itens.forEach((item) => {
      detalhes += `- ${item.nome} (x${item.quantidade}): R$ ${item.preco_unitario.toFixed(2)}\n`;
    });
    alert(detalhes);
  } catch (erro) {
    alert(`Erro ao carregar detalhes: ${erro.message}`);
  }
};

document.addEventListener('DOMContentLoaded', carregarPedidos);
