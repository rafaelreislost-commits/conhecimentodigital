// TEMPORÁRIO — endpoint de teste de entregabilidade. Manda o template de
// entrega (plano básico) pelo provedor escolhido, pra comparar se cai no
// spam. NÃO faz parte do fluxo de venda. Remover depois do teste.
//
//   /api/teste-envio?chave=ADMIN_TOKEN&provider=smtp
//   /api/teste-envio?chave=ADMIN_TOKEN&provider=sendgrid&to=alguem@email.com
import nodemailer from "nodemailer";
import { PLANOS } from "./_planos.js";

const SITE = "https://conhecimentodigital.vercel.app";

function montarHtml(plano) {
  const botoes = plano.arquivos
    .map(
      (a) => `
        <tr><td style="padding:6px 0">
          <a href="${a.url}" style="display:block;background-color:#FDF6E8;border:2px solid #2B2118;border-radius:8px;padding:14px 18px;text-decoration:none;color:#2B2118;font-weight:700;font-family:sans-serif;font-size:15px">
            &#11015; ${a.nome}
          </a>
        </td></tr>`
    )
    .join("");
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background-color:#ffffff">
      <div style="background-color:#3E7A2B;padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <img src="${SITE}/assets/logo-email.png" alt="Mundo dos Blocos" width="220" style="max-width:220px;height:auto" />
      </div>
      <div style="padding:28px 24px;border:2px solid #2B2118;border-top:none;border-radius:0 0 12px 12px">
        <h2 style="color:#2B2118;margin-top:0">Seu material chegou! &#127881;</h2>
        <p style="color:#2B2118;font-size:15px;line-height:1.6">
          Obrigado por comprar o <strong>${plano.titulo}</strong>. Seus arquivos já estão prontos &mdash; é só clicar em cada botão abaixo pra baixar:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0">${botoes}</table>
        <div style="background-color:#FDF6E8;border-radius:8px;padding:16px 18px;margin-top:8px">
          <p style="color:#2B2118;font-size:13px;line-height:1.6;margin:0">
            &#128161; <strong>Guarde este e-mail</strong> &mdash; os links são vitalícios, dá pra baixar de novo sempre que precisar, em qualquer aparelho.
          </p>
        </div>
        <p style="color:#6b6b6b;font-size:13px;line-height:1.6;margin-top:20px">
          Dúvidas ou problema com algum arquivo? É só responder este e-mail que a gente te ajuda.
        </p>
      </div>
      <p style="color:#9AA0A6;font-size:12px;margin-top:16px">
        Conhecimento Digital · Mundo dos Blocos — material educativo independente, sem vínculo com Mojang, Microsoft ou Roblox Corporation.
      </p>
    </div>`;
}

function montarTexto(plano) {
  const links = plano.arquivos.map((a) => `- ${a.nome}: ${a.url}`).join("\n");
  return `Seu material chegou!\n\nObrigado por comprar o ${plano.titulo}. Seus arquivos:\n\n${links}\n\nGuarde este e-mail — os links são vitalícios.\n\nDúvidas? Responda este e-mail.\n\nConhecimento Digital · Mundo dos Blocos`;
}

export default async function handler(req, res) {
  if (req.query.chave !== process.env.ADMIN_TOKEN) {
    return res.status(401).send("Acesso negado.");
  }
  const provider = (req.query.provider || "smtp").toLowerCase();
  const to = req.query.to || "conhecimentodigital67@outlook.com";
  const plano = PLANOS.basico;
  const html = montarHtml(plano);
  const text = montarTexto(plano);
  const subject = `[TESTE ${provider.toUpperCase()}] Seu material chegou! Mundo dos Blocos`;
  const from = process.env.SENDGRID_FROM || process.env.SMTP_USER;
  const replyTo = "conhecimentodigital67@outlook.com";

  try {
    if (provider === "sendgrid") {
      const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: from, name: "Mundo dos Blocos" },
          reply_to: { email: replyTo },
          subject,
          content: [
            { type: "text/plain", value: text },
            { type: "text/html", value: html },
          ],
        }),
      });
      const corpo = await r.text();
      return res.status(200).json({ provider, to, status: r.status, corpo: corpo || "(vazio = ok)" });
    }

    // SMTP direto do Outlook
    const transportador = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-mail.outlook.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const info = await transportador.sendMail({
      from: `Mundo dos Blocos <${process.env.SMTP_USER}>`,
      to,
      replyTo,
      subject,
      text,
      html,
    });
    return res.status(200).json({ provider, to, messageId: info.messageId, response: info.response });
  } catch (erro) {
    return res.status(500).json({ provider, erro: String(erro && erro.message || erro) });
  }
}
