# Geek Legends – Backend

**Backend do e-commerce Geek Legends**, desenvolvido em Node.js + Express com PostgreSQL. Segue arquitetura REST API profissional, autenticação JWT, separação de responsabilidades e padrão seguro para sistemas reais.

## 📦 O que está implementado (até o momento)

- **Conexão segura com PostgreSQL** usando variáveis de ambiente (.env)
- **Arquitetura profissional** (separação em routes, controllers, models, services, middlewares)
- **Cadastro e Login de Usuários** (hash seguro de senha com bcrypt, autenticação JWT, usuários admin)
- **Proteção de rotas** via middleware personalizado usando JWT:  
  - Apenas usuários autenticados podem acessar partes protegidas
  - Apenas admins podem cadastrar/editar/deletar categorias e produtos
- **CRUD de Categorias** completo
- **CRUD de Produtos** completo, já com relação categoria/produto
- **Carrinho de compras persistente** (cada usuário tem seu carrinho, pode adicionar/remover produto/quantidade)
- **Checkout/Pedido**:
  - Usuário converte o carrinho em pedido
  - Itens do carrinho são transferidos para o pedido
  - Usuário pode listar seus próprios pedidos
  - Admin pode ver todos os pedidos

## 🧩 Tecnologias & boas práticas

- Node.js (ESModules)
- Express
- PostgreSQL (acesso via `pg`)
- Senhas com hash Bcrypt
- JWT para autenticação e autorização
- Arquitetura REST, código limpo e fácil de manter

## 🗂️ Estrutura de Pastas

```
backEnd/
├── app.js                # Entrada da aplicação Express
├── .env                  # Dados de acesso ao banco e segredo JWT (NUNCA subir para o Git)
├── database/             # Conexão ao PostgreSQL
├── routes/               # Todas as APIs REST
├── controllers/          # Lógica das rotas
├── models/               # Query ao banco / ORM
├── services/             # Regras de negócio (hash, JWT...)
├── middlewares/          # JWT, admin e afins
```

## 🔓 Como funciona o fluxo principal

1. **Usuário cadastra/login** (POST `/api/usuarios/cadastrar` e `/api/usuarios/login`)
2. **Admin cadastra categoria/produto**
3. **Usuário visualiza/filtra produtos**
4. **Usuário monta carrinho** (adiciona, remove, edita quantidades)
5. **Usuário finaliza pedido** (POST `/api/pedidos/checkout`)
6. **Usuário visualiza pedidos / admin vê tudo**

## 📋 Estado atual

> Até aqui, a API está pronta até a parte de autenticação, categorias, produtos, carrinho, e pedidos.
> Todas as funções essenciais de um e-commerce simples funcionam, com proteção avançada.

---

**Dúvidas ou quer validar? Só conferir as rotas no Insomnia/Postman!**

---
