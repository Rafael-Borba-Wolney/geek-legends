import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Geek Legends API funcionando"
  });
});

app.get("/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Camiseta Batman",
      price: 89.90
    },
    {
      id: 2,
      name: "Caneca Star Wars",
      price: 49.90
    }
  ]);
});

app.post("/products", (req, res) => {
  console.log(req.body);

  res.status(201).json({
    message: "Produto criado"
  });
});

export default app;
