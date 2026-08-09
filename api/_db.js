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
