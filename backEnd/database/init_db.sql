-- Banco: geek_legends

-- USUÁRIOS
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(200) NOT NULL,
  eh_admin BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIAS
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- PRODUTOS
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  imagem_url VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  categoria_id INT REFERENCES categorias(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CARRINHO
CREATE TABLE carrinhos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITENS DO CARRINHO
CREATE TABLE itens_carrinho (
  id SERIAL PRIMARY KEY,
  carrinho_id INT REFERENCES carrinhos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade INT NOT NULL CHECK(quantidade > 0)
);

-- PEDIDOS
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status VARCHAR(30) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITENS DO PEDIDO
CREATE TABLE itens_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade INT NOT NULL CHECK(quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0)
);
