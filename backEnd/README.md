# ⚙️ Geek Legends — Backend

Backend da aplicação Geek Legends desenvolvido com:

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication

---

# 🔹 Objetivo

O backend é responsável por:

* autenticação,
* gerenciamento de produtos,
* controle de carrinho,
* processamento de pedidos,
* integração com banco PostgreSQL.

---

# 🔹 Tecnologias

* Node.js
* Express.js
* PostgreSQL
* bcrypt
* jsonwebtoken
* dotenv
* cors

---

# 🔹 Estrutura

```bash
backend/
│
├── controllers/
├── middleware/
├── routes/
├── services/
├── db/
├── server.js
├── package.json
└── .env
```

---

# 🔹 Rotas Principais

## 🔐 Auth

### Login

```http
POST /api/auth/login
```

### Cadastro

```http
POST /api/auth/cadastro
```

---

## 🛍️ Produtos

### Listar produtos

```http
GET /api/produtos
```

### Buscar produto

```http
GET /api/produtos/:id
```

---

## 🛒 Carrinho

### Ver carrinho

```http
GET /api/carrinho
```

### Adicionar produto

```http
POST /api/carrinho
```

### Remover produto

```http
DELETE /api/carrinho/:produtoId
```

---

## 📦 Pedidos

### Checkout

```http
POST /api/pedidos/checkout
```

### Listar pedidos

```http
GET /api/pedidos
```

---

# 🔹 JWT Authentication

O token JWT é enviado via:

```http
Authorization: Bearer TOKEN
```

Middleware protege rotas privadas.

---

# 🔹 Banco de Dados

## Tabelas principais

### usuarios

Armazena usuários cadastrados.

### produtos

Produtos do catálogo.

### categorias

Categorias geek.

### carrinhos

Carrinho associado ao usuário.

### itens_carrinho

Itens presentes no carrinho.

### pedidos

Pedidos realizados.

### itens_pedido

Produtos pertencentes ao pedido.

---

# 🔹 Instalação

## Instalar dependências

```bash
npm install
```

---

## Variáveis de ambiente

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=geek_legends

JWT_SECRET=sua_chave
```

---

# 🔹 Rodar servidor

```bash
npx nodemon app.js
```

---

# 🔹 Segurança

* Senhas criptografadas com bcrypt
* JWT para autenticação
* Middleware de autorização
* Validação básica de entrada

---

# 🔹 Melhorias Futuras

* Upload de imagens
* Painel administrativo
* Refresh token
* Rate limiting
* Validação avançada
* Logs estruturados

---
