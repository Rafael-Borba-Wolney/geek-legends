# Evolução do Projeto - Geek Legends

## Sprint 1 - Estrutura Inicial do Projeto

### Atividades realizadas
- Organização da estrutura inicial do projeto.
- Separação entre frontend e backend.
- Criação das páginas HTML do frontend.
- Criação dos arquivos CSS e JavaScript.
- Definição visual inicial da loja Geek Legends.

### Entregas
- Estrutura inicial do frontend.
- Páginas: início, produtos, carrinho, login e sobre.
- Layout inicial da aplicação.

### Próximos passos
- Criar a estrutura inicial do backend.
- Implementar uma API simples para produtos.

---

## Sprint 2 - Criação do Backend Inicial

### Atividades realizadas
- Criação da pasta `back-end`.
- Inicialização do projeto Node.js com `npm init`.
- Instalação das dependências Express, CORS e Nodemon.
- Criação do arquivo `server.js`.
- Implementação do servidor backend.

### Entregas
- Backend executável com Node.js e Express.
- Servidor rodando na porta 3000.
- Rota inicial `/`.
- Rota `/produtos` retornando produtos em JSON.

### Próximos passos
- Integrar o frontend com o backend.
- Consumir a API de produtos pelo JavaScript.

---

## Sprint 3 - Integração Frontend e Backend

### Atividades realizadas
- Configuração do CORS no backend.
- Criação da chamada `fetch` no arquivo `produtos.js`.
- Consumo da rota `http://localhost:3000/produtos`.
- Validação dos dados retornando no console do navegador.

### Entregas
- Frontend conectado ao backend.
- Produtos recebidos via API.
- Comunicação entre frontend e backend funcionando.

### Próximos passos
- Renderizar os produtos automaticamente na tela.
- Substituir produtos fixos do HTML por dados vindos da API.
- Implementar cadastro de produtos.
- Evoluir para integração com banco de dados PostgreSQL.