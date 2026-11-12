import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { autenticar } from '../middleware/autenticar.js';
import { criarUtilizador, procurarPorEmail, procurarPorId, semPassword } from '../utilizadores.js';

const router = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function gerarToken(utilizador) {
  return jwt.sign({ sub: utilizador.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRA || '2h',
  });
}

router.post('/registo', async (req, res) => {
  const { nome, email, password } = req.body ?? {};

  if (!nome?.trim()) return res.status(400).json({ erro: 'O nome é obrigatório' });
  if (!EMAIL_REGEX.test(email || '')) return res.status(400).json({ erro: 'Email inválido' });
  if (!password || password.length < 6) {
    return res.status(400).json({ erro: 'A password tem de ter pelo menos 6 caracteres' });
  }

  const emailNormalizado = email.toLowerCase().trim();
  if (await procurarPorEmail(emailNormalizado)) {
    return res.status(409).json({ erro: 'Já existe uma conta com este email' });
  }

  const utilizador = await criarUtilizador({
    id: randomUUID(),
    nome: nome.trim(),
    email: emailNormalizado,
    passwordHash: await bcrypt.hash(password, 10),
    criadoEm: new Date().toISOString(),
  });
  res.status(201).json(semPassword(utilizador));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  const utilizador = await procurarPorEmail(String(email || '').toLowerCase().trim());

  // Mesma mensagem nos dois casos para não revelar quais emails existem
  if (!utilizador || !(await bcrypt.compare(String(password || ''), utilizador.passwordHash))) {
    return res.status(401).json({ erro: 'Email ou password incorretos' });
  }

  res.json({ token: gerarToken(utilizador), utilizador: semPassword(utilizador) });
});

router.get('/perfil', autenticar, async (req, res) => {
  const utilizador = await procurarPorId(req.utilizadorId);
  if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });
  res.json(semPassword(utilizador));
});

export default router;
