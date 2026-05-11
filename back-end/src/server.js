const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let produtos = [
    {
        id: 1,
        nome: "Teclado Gamer",
        preco: 150
    },
    {
        id: 2,
        nome: "Mouse Gamer",
        preco: 80
    }
];

app.get("/", function(req, res) {
    res.send("Backend Geek Legends funcionando");
});

app.get("/produtos", function(req, res) {
    res.json(produtos);
});

app.post("/produtos", function(req, res) {

    let novoProduto = req.body;

    produtos.push(novoProduto);

    res.json({
        mensagem: "Produto cadastrado com sucesso",
        produto: novoProduto
    });

});

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");
});