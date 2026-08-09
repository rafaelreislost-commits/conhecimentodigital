// Relatório de vendas — lista todo cliente que comprou, com e-mail, plano,
// valor, método de pagamento e status. Protegido por senha simples via
// query string (?chave=...), configurada em ADMIN_TOKEN.
//
// Acesso: https://SEU-SITE.vercel.app/api/clientes?chave=SUA-SENHA
import { listarVendas } from "./_db.js";

function precoBR(v) {
  return Number(v).toFixed(2).replace(".", ",");
}

function escapeHtml(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

export default async function handler(req, res) {
  const senha = process.env.ADMIN_TOKEN;
  if (!senha) {
    return res.status(500).send("ADMIN_TOKEN não configurado no servidor.");
  }
  if (req.query.chave !== senha) {
    return res.status(401).send("Acesso negado. Use ?chave=SUA-SENHA na URL.");
  }

  let vendas = [];
  try {
    vendas = await listarVendas();
  } catch (erro) {
    console.error("Erro ao listar vendas:", erro);
    return res.status(500).send("Erro ao consultar o banco de dados.");
  }

  const total = vendas
    .filter((v) => v.status === "approved")
    .reduce((soma, v) => soma + Number(v.valor), 0);

  const linhas = vendas
    .map(
      (v) => `
        <tr>
          <td>${new Date(v.criado_em).toLocaleString("pt-BR")}</td>
          <td>${escapeHtml(v.email)}</td>
          <td>${escapeHtml(v.nome_pagador)}</td>
          <td>${escapeHtml(v.plano)}</td>
          <td>R$ ${precoBR(v.valor)}</td>
          <td>${escapeHtml(v.metodo_pagamento)}</td>
          <td><span class="status status-${escapeHtml(v.status)}">${escapeHtml(v.status)}</span></td>
        </tr>`
    )
    .join("");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Relatório de clientes — Mundo dos Blocos</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #FDF6E8; color: #2B2118; padding: 24px; }
        h1 { margin-bottom: 4px; }
        .resumo { color: #5A5248; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
        th { background: #3E7A2B; color: white; position: sticky; top: 0; }
        tr:hover { background: #FDF6E8; }
        .status { padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-approved { background: #5BA83F; color: white; }
        .status-pending { background: #F2A93B; color: white; }
        .status-rejected { background: #D9483B; color: white; }
      </style>
    </head>
    <body>
      <h1>Relatório de clientes</h1>
      <p class="resumo">
        ${vendas.length} pedido(s) registrado(s) · Total aprovado: <strong>R$ ${precoBR(total)}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th>Data</th><th>E-mail</th><th>Nome</th><th>Plano</th>
            <th>Valor</th><th>Método</th><th>Status</th>
          </tr>
        </thead>
        <tbody>${linhas || '<tr><td colspan="7">Nenhuma venda registrada ainda.</td></tr>'}</tbody>
      </table>
    </body>
    </html>
  `);
}
