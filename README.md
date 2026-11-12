# 🔐 API de Autenticação com JWT

API de **registo e login** de utilizadores com passwords encriptadas (bcrypt) e
**rotas protegidas** por JSON Web Token. Serve de back-end aos projetos
[`11-react-login`](../11-react-login) e [`22-ionic-login`](../22-ionic-login).

## 🛠️ Tecnologias
- Node.js + Express 5
- `bcryptjs` (hash de passwords)
- `jsonwebtoken` (JWT)
- `dotenv` e `cors`

## ▶️ Como executar
```bash
npm install
cp .env.example .env   # e altera o JWT_SECRET
npm run dev
```

## 📚 Endpoints

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | `/auth/registo` | ❌ | Cria conta (`nome`, `email`, `password`) |
| POST | `/auth/login` | ❌ | Devolve `{ token, utilizador }` |
| GET | `/auth/perfil` | ✅ | Dados do utilizador autenticado |

Nas rotas protegidas envia o header `Authorization: Bearer <token>`.

## 🔒 Boas práticas aplicadas
- Passwords guardadas apenas como hash (bcrypt, 10 rounds)
- A password/hash nunca é devolvida pela API
- Mensagem de erro genérica no login (não revela se o email existe)
- Segredo do JWT em variável de ambiente, fora do código
- Middleware reutilizável para proteger rotas
