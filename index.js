import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontEnd")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontEnd", "index.html"));
});

app.get("/produtos", (req, res) => {
  res.sendFile(path.join(__dirname, "frontEnd", "produtos.html"));
});

app.get("/sobre", (req, res) => {
  res.sendFile(path.join(__dirname, "frontEnd", "sobre.html"));
});

app.get("/carrinho", (req, res) => {
  res.sendFile(path.join(__dirname, "frontEnd", "carrinho.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
