
# 🥗 FSI.MealTracker.FrontEnd

Sistema de gerenciamento de refeições e calorias consumidas durante o dia — este é o front-end do projeto **FSI.MealTracker**, desenvolvido em **HTML, CSS e JavaScript puro**, com arquitetura baseada em carregamento dinâmico de páginas e scripts por rota.

## 📌 Visão Geral

A aplicação tem como objetivo:

- Permitir o cadastro, listagem e edição de alimentos e refeições.
- Integrar-se com APIs REST (sincronamente e assincronamente).
- Apresentar uma interface dinâmica e modular, sem necessidade de frameworks pesados.

---

## 🚀 Como executar o projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/rodrigofurlaneti/FSI.MealTracker.FrontEnd.git
```

2. **Abra o arquivo `src/index.html` diretamente no navegador** (sem necessidade de servidor local, exceto se precisar chamar APIs locais).

---

## 🗂️ Estrutura de Pastas

```
src/
│
├── assets/
│   ├── css/               # Estilos (incluindo Bootstrap customizado)
│   └── js/
│       ├── bootstrap/     # Bootstrap JS
│       ├── food/          # Scripts de CRUD para alimentos
│       ├── home/          # Script da home
│       ├── lang.js        # Sistema de tradução
│       ├── index.js       # Loader de rotas e páginas
│       └── routes.js      # Endpoints da API
│
├── pages/
│   ├── config/            # (Futura configuração do sistema)
│   ├── food/              # Páginas de inserção, edição e listagem de alimentos
│   └── home/              # Página inicial
│
└── index.html             # Estrutura HTML base
```

---

## 🧠 Arquitetura

A arquitetura é baseada em **Componentização Modular com JavaScript Puro**, com os seguintes princípios:

### 🧩 Carregamento dinâmico

- A função `loadContent(model, page)` no `index.js` faz o carregamento dinâmico de páginas HTML e scripts JS conforme navegação.
- Isso simula um **Single Page Application (SPA)** leve, sem frameworks.

### 🌐 Roteamento de API centralizado

- O arquivo `routes.js` centraliza todas as rotas da API, facilitando manutenção.
- Suporte tanto para chamadas síncronas (`/sync`) quanto assíncronas (`/async`), refletindo uma integração back-end com **RabbitMQ** ou similares.

### 🌍 Suporte a multilínguas

- `lang.js` implementa o sistema de tradução com `data-i18n`, alterando dinamicamente o idioma exibido com base na seleção do usuário.
- Exibe a bandeira do país e o idioma atual.

---

## 🔧 Tecnologias Utilizadas

- HTML5 / CSS3 / Bootstrap
- JavaScript puro (Vanilla JS)
- Modularização de código
- API REST (com back-end externo)
- Padrões SPA leves (sem frameworks)
- RabbitMQ (no contexto do back-end)

---

## 📌 Funcionalidades principais

- ✅ Listagem de alimentos com ordenação e filtro
- ✅ Cadastro e edição de alimentos
- ✅ Integração com API assíncrona e síncrona
- ✅ Suporte multilíngue (Português, Espanhol, Inglês)
- ✅ Organização de rotas e scripts modularizados

---

## 🧪 Testes

Este projeto **não utiliza testes automatizados no front-end**, por se tratar de uma aplicação leve em HTML/JS puro. Porém, o back-end (em .NET) contém testes unitários e integração com RabbitMQ.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
