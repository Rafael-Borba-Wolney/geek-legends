# 🛒 Geek Legends

**Geek Legends** é um sistema web de e-commerce geek desenvolvido como projeto acadêmico utilizando **Node.js**, **Express.js**, **PostgreSQL** e **JavaScript modularizado no frontend**.

O sistema permite que usuários realizem cadastro, login, naveguem por produtos geek, adicionem itens ao carrinho, finalizem compras e acompanhem seus pedidos.

O projeto foi desenvolvido com foco em:

* arquitetura organizada,
* separação entre frontend e backend,
* autenticação com JWT,
* consumo de API REST,
* manipulação dinâmica de DOM,
* integração com banco de dados relacional.

---

# 🔹 Funcionalidades

## 👤 Usuários

* Cadastro de usuários
* Login autenticado via JWT
* Logout
* Página de perfil
* Proteção de rotas privadas

---

## 🛍️ Produtos

* Listagem dinâmica de produtos
* Categorias geek:

  * Filmes
  * Séries
  * Jogos
  * Tecnologia
  * Animes
  * Roupas
* Renderização de imagens dos produtos
* Produtos armazenados no PostgreSQL

---

## 🛒 Carrinho

* Adicionar produtos ao carrinho
* Atualizar quantidade
* Remover produtos
* Contador de itens em tempo real
* Cálculo automático de subtotal e total

---

## 📦 Pedidos

* Finalização de compra
* Criação de pedidos
* Histórico de pedidos do usuário

---

# 🔹 Tecnologias Utilizadas

## Backend

* Node.js
* Express.js
* PostgreSQL
* JWT
* bcrypt
* dotenv
* cors

## Frontend

* HTML5
* CSS3
* JavaScript ES Modules
* Fetch API

---

# 🔹 Estrutura do Projeto

```bash
GeekLegends/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── db/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   │
│   ├── index.html
│   ├── login.html
│   ├── produtos.html
│   ├── carrinho.html
│   ├── pedidos.html
│   └── perfil.html
│
└── README.md
```

---

# 🔹 Banco de Dados

O sistema utiliza PostgreSQL.

Principais tabelas:

* usuarios
* categorias
* produtos
* carrinhos
* itens_carrinho
* pedidos
* itens_pedido

---

# 🔹 Instalação

# 1️⃣ Clonar o repositório

```bash
https://github.com/Rafael-Borba-Wolney/geek-legends/tree/dev
```

---

# 2️⃣ Instalar dependências

## Backend

```bash
cd backend
npm install
```

---

# 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env`:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=geek_legends

JWT_SECRET=sua_chave_jwt
```

---

# 4️⃣ Configurar banco de dados

Execute o script SQL de criação das tabelas no PostgreSQL.

---

# 5️⃣ Rodar backend

```bash
npx nodemon app.js
```

Servidor:

```bash
http://localhost:3001
```

---

# 6️⃣ Rodar frontend

Abra o frontend utilizando uma extensão como:

* Live Server
* http-server
* Python HTTP Server

Exemplo:

```bash
cd frontEnd/

```

```bash
python -m http.server 5500
```

Frontend:

```bash
http://localhost:5500
```

---

# 🔹 Fluxo Geral do Sistema

## Login

O usuário realiza login → recebe JWT → token é salvo no localStorage.

---

## Carrinho

O frontend consome:

```bash
/api/carrinho
```

O backend retorna:

* produtos,
* quantidades,
* totais.

---

## Checkout

Ao finalizar compra:

* pedido é criado,
* itens são transferidos,
* carrinho é limpo.

---

# 🔹 Recursos Implementados

✅ JWT Authentication
✅ Carrinho persistente
✅ API REST
✅ Manipulação dinâmica de DOM
✅ Integração PostgreSQL
✅ Frontend modularizado
✅ Proteção de rotas
✅ Atualização automática do contador do carrinho
✅ Página de perfil do usuário
✅ Histórico de pedidos

---

# 🔹 Melhorias Futuras

* Upload real de imagens
* Dashboard administrativo
* Sistema de favoritos
* Pagamento online
* Responsividade mobile completa
* Busca avançada de produtos
* Filtros por categoria

---

# 🔹 Autor

Projeto desenvolvido por Querley Ferreira, Rafael Borba Wolney e Davi Padilha como trabalho acadêmico para o curso de Análise e Desenvolvimento de Sistemas.

---
