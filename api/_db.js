// Conexão com o Vercel Postgres — usada pra registrar cada venda aprovada.
// A env var POSTGRES_URL é injetada automaticamente pela Vercel quando o
// banco está conectado ao projeto (Storage → Postgres → Connect Project).
import { sql } from "@vercel/postgres";

let tabelaPronta = false;

// Cria a tabela na primeira chamada, se ainda não existir. Idempotente e
// barato — não precisa de script de migração separado.
export async function garantirTabela() {
  if (tabelaPronta) return;
  await sql`
    CREATE TABLE IF NOT EXISTS vendas (
      id SERIAL PRIMARY KEY,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
      payment_id TEXT UNIQUE NOT NULL,
      plano TEXT NOT NULL,
      email TEXT NOT NULL,
      nome_pagador TEXT,
      valor NUMERIC(10,2) NOT NULL,
      metodo_pagamento TEXT,
      status TEXT NOT NULL
    )
  `;
  tabelaPronta = true;
}

export async function registrarVenda({
  paymentId,
  plano,
  email,
  nomePagador,
  valor,
  metodoPagamento,
  status,
}) {
  await garantirTabela();
  // ON CONFLICT: o Mercado Pago pode reenviar o mesmo evento de webhook
  // mais de uma vez — sem isso, viraria venda duplicada no relatório.
  await sql`
    INSERT INTO vendas (payment_id, plano, email, nome_pagador, valor, metodo_pagamento, status)
    VALUES (${paymentId}, ${plano}, ${email}, ${nomePagador}, ${valor}, ${metodoPagamento}, ${status})
    ON CONFLICT (payment_id) DO UPDATE SET status = EXCLUDED.status
  `;
}

export async function listarVendas() {
  await garantirTabela();
  const { rows } = await sql`SELECT * FROM vendas ORDER BY criado_em DESC`;
  return rows;
}

// --- TikTok: tokens de OAuth (1 linha por conta conectada) ------------------

let tabelaTiktokPronta = false;

async function garantirTabelaTiktok() {
  if (tabelaTiktokPronta) return;
  await sql`
    CREATE TABLE IF NOT EXISTS tiktok_tokens (
      open_id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      access_token_expires_at TIMESTAMPTZ NOT NULL,
      refresh_token_expires_at TIMESTAMPTZ NOT NULL,
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  tabelaTiktokPronta = true;
}

export async function salvarTokenTiktok({
  openId,
  accessToken,
  refreshToken,
  expiresIn,
  refreshExpiresIn,
}) {
  await garantirTabelaTiktok();
  await sql`
    INSERT INTO tiktok_tokens (open_id, access_token, refresh_token, access_token_expires_at, refresh_token_expires_at, atualizado_em)
    VALUES (
      ${openId}, ${accessToken}, ${refreshToken},
      now() + (${expiresIn} || ' seconds')::interval,
      now() + (${refreshExpiresIn} || ' seconds')::interval,
      now()
    )
    ON CONFLICT (open_id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      access_token_expires_at = EXCLUDED.access_token_expires_at,
      refresh_token_expires_at = EXCLUDED.refresh_token_expires_at,
      atualizado_em = now()
  `;
}

// Pega a conta conectada mais recente. Hoje só conectamos uma conta TikTok,
// então "a mais recente" é sempre a certa.
export async function pegarTokenTiktok() {
  await garantirTabelaTiktok();
  const { rows } = await sql`
    SELECT * FROM tiktok_tokens ORDER BY atualizado_em DESC LIMIT 1
  `;
  return rows[0] || null;
}

// --- Instagram: DMs já respondidas (dedupe) ---------------------------------

let tabelaIgDmPronta = false;

async function garantirTabelaIgDm() {
  if (tabelaIgDmPronta) return;
  await sql`
    CREATE TABLE IF NOT EXISTS ig_dms_respondidas (
      message_id TEXT PRIMARY KEY,
      remetente_id TEXT NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  tabelaIgDmPronta = true;
}

// Retorna true se essa mensagem já tinha sido registrada (já respondida ou em
// processamento) — o Instagram reenvia o mesmo evento de webhook às vezes.
export async function jaRespondeuDm({ messageId, remetenteId }) {
  await garantirTabelaIgDm();
  const { rows } = await sql`
    INSERT INTO ig_dms_respondidas (message_id, remetente_id)
    VALUES (${messageId}, ${remetenteId})
    ON CONFLICT (message_id) DO NOTHING
    RETURNING message_id
  `;
  return rows.length === 0;
}
