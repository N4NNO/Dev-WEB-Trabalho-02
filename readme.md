# Futebol API - Gestão de Mensalistas

Sistema completo para o controle de jogadores mensalistas e registros de fluxos de pagamentos para partidas de futebol. A aplicação conta com uma API REST robusta construída em Node.js com persistência de dados real (SQLite) e uma interface amigável desenvolvida em React.

## 👥 Membros da Equipe
* **Marcelo Parolim Dias**
* **Angelo Cardoso Da Costa**
* **João Gabriel Azevedo Silva**

## 🗓️ Detalhes da Entrega
* **Data de Entrega / Apresentação:** 17/06/2026 (às 07:20h)
* **Tempo de Exposição:** Máximo de 10 minutos (Ordem por sorteio)

---

## 🛠️ Tecnologias Utilizadas

### Back-end (API REST)
* **Node.js & Express:** Ambiente de execução e framework para o gerenciamento de rotas e requisições HTTP.
* **SQLite3:** Banco de dados relacional embarcado para persistência real de dados.
* **CORS:** Middleware para permitir a comunicação segura com o ecossistema do Front-end.

### Front-end
* **React (Componentes Funcionais & Hooks):** Gerenciamento dinâmico de estados (`useState`, `useEffect`) para renderização reativa dos dados na tela.
* **CSS Grid & Flexbox:** Layout moderno e responsivo estruturado em cartões.
* **Fetch API:** Consumo assíncrono dos endpoints nativos da API.

---

## 📂 Estrutura de Pastas do Projeto

```text
├── database.db          # Banco de dados SQLite persistente
├── package.json         # Dependências e scripts do Node.js
├── package-lock.json    # Histórico de versões das dependências
├── server.js            # Inicialização do servidor Express e rotas da API
└── public/              # Pasta pública servida pelo back-end (Front-end)
    ├── index.html       # Estrutura principal da página (Single Page Application)
    ├── App.css          # Estilização visual (CSS Grid/Flexbox)
    └── App.js           # Lógica do componente React e chamadas da API
```
## 🚀 Como Executar o Programa
Abra o terminal do seu editor de código diretamente na pasta raiz do projeto e execute os comandos abaixo:

1. Instalar as Dependências
Baixe os pacotes necessários configurados no sistema (express, sqlite3 e cors):

npm install

2. Iniciar o Sistema
Inicialize o servidor local integrado:

npm start

3. Acessar no Navegador
Abra o navegador web e acesse o endereço:
Plaintext

http://localhost:3001

O servidor entregará a interface em React e gerenciará o banco de dados automaticamente na mesma porta.