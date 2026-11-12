import { readFile, writeFile, mkdir } from 'node:fs/promises';

const PASTA = new URL('../data/', import.meta.url);
const FICHEIRO = new URL('utilizadores.json', PASTA);

async function lerTodos() {
  try {
    return JSON.parse(await readFile(FICHEIRO, 'utf-8'));
  } catch (erro) {
    if (erro.code === 'ENOENT') return [];
    throw erro;
  }
}

export async function procurarPorEmail(email) {
  return (await lerTodos()).find((u) => u.email === email);
}

export async function procurarPorId(id) {
  return (await lerTodos()).find((u) => u.id === id);
}

export async function criarUtilizador(utilizador) {
  const todos = await lerTodos();
  todos.push(utilizador);
  await mkdir(PASTA, { recursive: true });
  await writeFile(FICHEIRO, JSON.stringify(todos, null, 2));
  return utilizador;
}

// Nunca devolver a password (nem o hash) nas respostas da API
export function semPassword({ passwordHash, ...resto }) {
  return resto;
}
