import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';

if (!process.env.JWT_SECRET) {
  console.error('❌ Define JWT_SECRET no ficheiro .env (vê o .env.example)');
  process.exit(1);
}

const app = express();
const PORTA = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ mensagem: 'API de autenticação 🔐' }));
app.use('/auth', authRouter);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(erro.status || 500).json({ erro: erro.status ? erro.message : 'Erro interno do servidor' });
});

app.listen(PORTA, () => console.log(`🔐 Auth API em http://localhost:${PORTA}`));
