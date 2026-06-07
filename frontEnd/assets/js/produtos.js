// Pega todos os produtos da página
const produtos = document.querySelectorAll(".produto");

// Pega todas as categorias do filtro
const categorias = document.querySelectorAll(".filtros li");

// Pega o campo de busca
const campoBusca = document.querySelector(".buscar-produto");

// Passa por cada categoria
categorias.forEach(function (categoria) {

  // Quando clicar em uma categoria
  categoria.addEventListener("click", function () {

    // Remove o selecionado de todas as categorias
    categorias.forEach(function (item) {
      item.classList.remove("selecionado");
    });

    // Marca a categoria clicada como selecionada
    categoria.classList.add("selecionado");

    // Pega o texto da categoria clicada
    const textoCategoria = categoria.textContent.toLowerCase();

    // Limpa o campo de busca quando trocar de categoria
    campoBusca.value = "";

    // Se clicar em todos, mostra todos os produtos
    if (textoCategoria.includes("todos")) {
      produtos.forEach(function (produto) {
        produto.style.display = "block";
      });
    }

    // Se clicar em filmes, mostra só filmes
    else if (textoCategoria.includes("filmes")) {
      filtrarProdutos("filmes");
    }

    // Se clicar em séries, mostra só séries
    else if (textoCategoria.includes("séries")) {
      filtrarProdutos("series");
    }

    // Se clicar em jogos, mostra só jogos
    else if (textoCategoria.includes("jogos")) {
      filtrarProdutos("jogos");
    }

    // Se clicar em animes, mostra só animes
    else if (textoCategoria.includes("animes")) {
      filtrarProdutos("animes");
    }

    // Se clicar em tecnologia, mostra só tecnologia
    else if (textoCategoria.includes("tecnologia")) {
      filtrarProdutos("tecnologia");
    }

  });
});

// Função para filtrar produtos
function filtrarProdutos(categoriaEscolhida) {

  // Passa por todos os produtos
  produtos.forEach(function (produto) {

    // Se o produto tiver a categoria escolhida, aparece
    if (produto.classList.contains(categoriaEscolhida)) {
      produto.style.display = "block";
    }

    // Se não tiver, fica escondido
    else {
      produto.style.display = "none";
    }

  });
}

// Quando digitar no campo de busca
campoBusca.addEventListener("input", function () {

  // Pega o texto digitado e deixa minúsculo
  const textoBusca = campoBusca.value.toLowerCase();

  // Passa por todos os produtos
  produtos.forEach(function (produto) {

    // Pega o título do produto
    const nomeProduto = produto.querySelector("h4").textContent.toLowerCase();

    // Se o nome incluir o texto digitado, aparece
    if (nomeProduto.includes(textoBusca)) {
      produto.style.display = "block";
    }

    // Se não incluir, esconde
    else {
      produto.style.display = "none";
    }

  });
});

// Pega todos os botões de carrinho dos produtos
const botoesCarrinho = document.querySelectorAll(".btn-carrinho");

// Pega o contador do carrinho
const contadorCarrinho = document.getElementById("contador-carrinho");

// Começa o carrinho com zero itens
let quantidadeCarrinho = 0;

// Passa por todos os botões
botoesCarrinho.forEach(function (botao) {

  // Quando clicar no botão
  botao.addEventListener("click", function () {

    // Aumenta a quantidade do carrinho
    quantidadeCarrinho++;

    // Atualiza o número que aparece no menu
    contadorCarrinho.textContent = quantidadeCarrinho;

    // Mostra uma mensagem simples
    alert("Produto adicionado ao carrinho!");
  });

});