# 🎨 Geek Legends — Frontend

Frontend do sistema Geek Legends desenvolvido com:

* HTML5
* CSS3
* JavaScript Vanilla Modularizado

---

# 🔹 Objetivo

O frontend é responsável pela interface visual e pela comunicação com a API backend.

O sistema utiliza:

* Fetch API
* DOM manipulation
* módulos ES6
* localStorage

---

# 🔹 Páginas

## index.html

Página inicial.

---

## produtos.html

Catálogo de produtos.

Funcionalidades:

* renderização dinâmica,
* adicionar ao carrinho,
* imagens dos produtos,
* categorias.

---

## carrinho.html

Página do carrinho.

Funcionalidades:

* atualizar quantidade,
* remover produtos,
* cálculo automático,
* finalizar compra.

---

## login.html

Autenticação do usuário.

---

## cadastro.html

Cadastro de novos usuários.

---

## perfil.html

Perfil do usuário.

Funcionalidades:

* visualizar dados,
* logout,
* acessar pedidos.

---

## pedidos.html

Histórico de pedidos.

---

# 🔹 Estrutura

```bash
frontend/
│
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
│
├── index.html
├── produtos.html
├── login.html
├── cadastro.html
├── carrinho.html
├── perfil.html
└── pedidos.html
```

---

# 🔹 JavaScript Modularizado

## auth.js

Responsável por:

* login,
* cadastro,
* logout,
* localStorage,
* autenticação.

---

## api.js

Centraliza chamadas Fetch API.

---

## ui.js

Controla:

* navbar,
* contador do carrinho,
* interface global.

---

## cart.js

Controla:

* renderização do carrinho,
* atualização de itens,
* checkout.

---

## profile.js

Carrega dados do perfil.

---

# 🔹 Comunicação com API

Exemplo:

```javascript
fetch('http://localhost:3001/api/produtos')
```

---

# 🔹 Armazenamento Local

O frontend utiliza:

```javascript
localStorage
```

para armazenar:

* token JWT
* dados do usuário

---

# 🔹 Renderização Dinâmica

Produtos e carrinho são renderizados dinamicamente usando:

* createElement
* innerHTML
* appendChild

---

# 🔹 Imagens dos Produtos

As imagens ficam em:

```bash
assets/images/
```

Exemplo:

```bash
assets/images/goku.jpg
```

No banco:

```sql
imagem_url = 'assets/images/goku.jpg'
```

---

# 🔹 Rodar Frontend

Exemplo com Python:

```bash
cd frontEnd/

```

```bash
python -m http.server 5500
```

ou com Live Server no VSCode.

---

# 🔹 Recursos Implementados

✅ Navbar dinâmica
✅ Carrinho em tempo real
✅ Integração com backend
✅ Login persistente
✅ Página de perfil
✅ Histórico de pedidos
✅ Atualização automática do contador

---

# 🔹 Melhorias Futuras

* Responsividade completa
* Skeleton loading
* Toast notifications melhores
* Busca de produtos
* Dark/light mode
* Upload de avatar

---
