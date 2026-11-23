# Sistema de Biblioteca — Front-end (`jwt-app`)

Interface web para gestão de biblioteca desenvolvida com **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS** e **Axios**, integrada à API `jwt-api` com renovação automática de sessão via **Refresh Token**.

---

## 1. Como instalar e rodar o projeto

### Pré-requisitos
- Node.js 20 ou superior e npm
- API back-end (`jwt-api`) rodando em `http://localhost:3001`

### Passo a passo

```bash
# 1. Entre na pasta do front-end e instale as dependências
cd jwt-app
npm install

# 2. Crie o arquivo .env a partir do .envex
cp .envex .env        # no Windows (CMD): copy .envex .env
```

Configure o arquivo `.env` apontando para a URL da API:

```env
API_URL=http://localhost:3001/v1
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Credenciais padrão (criadas pelo seed da API)
- **E-mail:** `admin@biblioteca.com`
- **Senha:** `123456`

---

## 2. Armazenamento dos Tokens e Análise de Riscos (Seção 4.3)

### Escolha adotada: Cookies `httpOnly` (`lib/session.ts`)

No momento do login (`actions/login.ts`), o `accessToken` (15 minutos) e o `refreshToken` (7 dias) são gravados em **cookies `httpOnly`** com `sameSite: 'lax'` e `secure: true`, em vez de `localStorage` ou `sessionStorage`.

### Vantagens e Riscos da Escolha

1. **Proteção contra XSS (Cross-Site Scripting) — Por que não usamos `localStorage`:**
   - Qualquer valor salvo no `localStorage` ou `sessionStorage` pode ser lido livremente por scripts no navegador via `window.localStorage.getItem(...)`. Caso a aplicação sofresse uma injeção de script (XSS) ou tivesse uma extensão/dependência comprometida no cliente, o invasor poderia roubar o `refreshToken` de 7 dias.
   - Com a flag **`httpOnly: true`**, o navegador impede completamente que o JavaScript do cliente (`document.cookie`) leia os tokens. Apenas o servidor do Next.js (em *Server Components*, *Server Actions* e no `proxy.ts`) tem acesso aos cookies para montar o header `Authorization: Bearer <token>`.
2. **Risco de CSRF (Cross-Site Request Forgery) nos Cookies e Mitigação:**
   - O principal risco associado ao uso de cookies é o **CSRF**, em que uma página externa maliciosa tenta disparar requisições fazendo o navegador enviar os cookies automaticamente.
   - **Como mitigamos esse risco:**
     - Os cookies utilizam **`sameSite: 'lax'`**, bloqueando o envio automático em requisições *cross-site* de escrita (`POST`, `PUT`, `PATCH`, `DELETE`).
     - As mutações do front-end são feitas via **Server Actions do Next.js**, que possuem verificação nativa de cabeçalho `Origin`/`Host`.
     - A API back-end (`jwt-api`) não autentica por cookie automático, mas sim exigindo o cabeçalho explícito `Authorization: Bearer <token>` enviado pelo servidor do Next.js.

---

## 3. Renovação Automática de Token e Fila de Requisição Única

A renovação transparente da sessão foi implementada em dois arquivos principais:

1. **`proxy.ts` (Interceptador de Rotas Protegidas):**
   - Intercepta todas as navegações e chamadas de *Server Actions* em `/dashboard/:path*`.
   - Verifica se o `accessToken` está presente e válido. Caso tenha expirado (ou faltem menos de 10 segundos para vencer), aciona o refresh antes da página ou action executar, atualizando os cookies (`token` e `refreshToken`) na requisição e na resposta sem deslogar o usuário.
   - Caso o `refreshToken` também seja inválido, expirado ou tenha sido revogado, limpa os cookies da sessão e redireciona para a tela de login (`/`).
2. **`lib/refresh.ts` (Fila de Refresh Único):**
   - Como o back-end utiliza **rotação de refresh token com detecção de reuso** (se o mesmo refresh token for enviado duas vezes, o back-end considera roubo de token e derruba todas as sessões do usuário), o front-end **jamais pode disparar duas chamadas simultâneas** para `POST /v1/auth/refresh` com o mesmo token.
   - O `lib/refresh.ts` mantém um `Map` com a `Promise` da renovação em andamento indexada pelo `refreshToken`. Se várias requisições baterem ao mesmo tempo com o access token expirado, **apenas a primeira chama `/auth/refresh`**, enquanto as demais aguardam na fila o resultado da mesma `Promise`.

---

## 4. Telas e Funcionalidades Implementadas

| Rota no Front-end | Descrição | Perfil |
|---|---|---|
| `/` | **Login** com validação e exibição de mensagens de erro vindas da API (ex: credenciais inválidas ou atendente desativado) | Público |
| `/dashboard` | **Dashboard**: exibe os cards com total de livros, exemplares disponíveis, empréstimos ativos, atrasados e total de multas (`GET /v1/reports/dashboard`) | Admin e Atendente |
| `/dashboard/categorias` e `/[id]` | **Categorias**: listagem, cadastro, edição e exclusão (exibindo erro `409 Conflict` quando possui livros vinculados) | Leitura: Todos / Escrita: Admin |
| `/dashboard/autores` e `/[id]` | **Autores**: listagem, cadastro, edição e exclusão (exibindo erro `409 Conflict` quando possui livros vinculados) | Leitura: Todos / Escrita: Admin |
| `/dashboard/livros` e `/[id]` | **Livros**: busca com filtros combinados (título, categoria, autor e só disponíveis), cadastro/edição com seleção de categoria e múltiplos autores, e destaque de exemplares disponíveis | Leitura: Todos / Escrita: Admin |
| `/dashboard/leitores` e `/[id]` | **Leitores**: listagem, cadastro, edição e tabela com o **histórico completo de empréstimos** do leitor (`GET /v1/readers/:id/loans`) | Admin e Atendente |
| `/dashboard/emprestimos` e `/novo` | **Empréstimos**: registro de novo empréstimo (seleção de leitor e livro disponível), filtro por status (`Todos`, `Ativos`, `Atrasados`, `Devolvidos`) e botão de **devolução** informando o valor da multa calculada | Admin e Atendente |
| `/dashboard/atendentes` e `/[id]` | **Atendentes**: listagem, cadastro, edição e botão de **ativar/desativar** atendente (item oculto no menu superior para quem não é administrador) | Somente Admin |

---

## 5. Estrutura de Pastas

```text
jwt-app/
├── actions/             (Server Actions: login, logout, category, author, book, reader, loan, user)
├── components/
│   ├── Menu.tsx         (barra superior com links, ocultação do menu de admin, nome do usuário e logout)
│   └── LogoutButton.tsx (botão de encerramento de sessão)
├── lib/
│   ├── api.ts           (instância do Axios configurada com API_URL)
│   ├── session.ts       (leitura, gravação e limpeza dos cookies httpOnly)
│   ├── refresh.ts       (renovação do par de tokens com fila de requisição única)
│   ├── data.ts          (função apiGet centralizada para Server Components)
│   ├── types.ts         (tipagens TypeScript espelhadas nos models da API)
│   └── ui.ts            (classes padronizadas do Tailwind CSS com a identidade visual Unipar)
├── app/
│   ├── page.tsx         (tela de Login)
│   └── dashboard/       (layout com Menu + páginas de categorias, autores, livros, leitores, empréstimos e atendentes)
└── proxy.ts             (proteção de rotas e rotação automática de tokens)
```
