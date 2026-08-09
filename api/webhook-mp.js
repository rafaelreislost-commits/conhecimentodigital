// Vercel Serverless Function — recebida pelo Mercado Pago quando o status de
// um pagamento muda. Se aprovado, manda por e-mail os links de download do
// material comprado, via Resend.
//
// Configurar essa URL no Mercado Pago não é necessário manualmente: ela é
// enviada automaticamente em cada preferência criada (ver notification_url
// em criar-pagamento.js). Env vars necessárias na Vercel:
//   MP_ACCESS_TOKEN, RESEND_API_KEY, EMAIL_REMETENTE
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";
import { PLANOS, validarArquivos } from "./_planos.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  // O Mercado Pago manda o id do pagamento tanto na query quanto no corpo,
  // dependendo da versão/evento. Aceita os dois formatos.
  const tipo = req.query.type ?? req.body?.type ?? req.body?.action;
  const paymentId = req.query["data.id"] ?? req.body?.data?.id;

  if (tipo !== "payment" || !paymentId) {
    // Outros tipos de evento (ex: merchant_order) — ignora sem erro.
    return res.status(200).end();
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("MP_ACCESS_TOKEN não configurado");
    return res.status(200).end(); // 200 pro MP não ficar retentando à toa
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const pagamento = await new Payment(client).get({ id: paymentId });

    if (pagamento.status !== "approved") {
      return res.status(200).end();
    }

    const planoId = pagamento.external_reference;
    const plano = PLANOS[planoId];
    const emailCliente = pagamento.payer?.email;

    if (!plano || !emailCliente) {
      console.error("Pagamento aprovado sem plano ou e-mail reconhecível", {
        paymentId,
        planoId,
        emailCliente,
      });
      return res.status(200).end();
    }

    if (!validarArquivos(plano)) {
      console.error(
        `Plano "${planoId}" tem material sem URL — rode scripts/upload-materiais.mjs. Pagamento ${paymentId} NÃO recebeu e-mail.`
      );
      return res.status(200).end();
    }

    await enviarEmailComMateriais({ email: emailCliente, plano });
    return res.status(200).end();
  } catch (erro) {
    console.error("Erro processando webhook Mercado Pago:", erro);
    // Responde 200 mesmo assim: um 4xx/5xx faz o MP reenviar o mesmo evento
    // várias vezes, o que pode gerar e-mails duplicados quando o problema é
    // no nosso lado (ex: Resend fora do ar) e não algo que um retry resolve.
    return res.status(200).end();
  }
}

// Domínio público onde os assets do e-mail ficam hospedados (e-mail não
// pode referenciar caminho relativo — precisa de URL absoluta).
const SITE = "https://conhecimentodigital.vercel.app";

async function enviarEmailComMateriais({ email, plano }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const remetente = process.env.EMAIL_REMETENTE || "Mundo dos Blocos <onboarding@resend.dev>";

  const botoesHtml = plano.arquivos
    .map(
      (a) => `
        <tr>
          <td style="padding:6px 0">
            <a href="${a.url}"
               style="display:block;background:#FDF6E8;border:2px solid #2B2118;border-radius:8px;
                      padding:14px 18px;text-decoration:none;color:#2B2118;font-weight:700;
                      font-family:sans-serif;font-size:15px">
              ⬇ ${a.nome}
            </a>
          </td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: remetente,
    to: email,
    replyTo: process.env.EMAIL_RESPOSTA || "conhecimentodigital67@outlook.com",
    subject: "Seu material chegou! 🎮 Mundo dos Blocos",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#ffffff">
        <div style="background:#3E7A2B;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <img src="${SITE}/assets/logo-email.png" alt="Mundo dos Blocos" width="220" style="max-width:220px;height:auto" />
        </div>

        <div style="padding:28px 24px;border:2px solid #2B2118;border-top:none;border-radius:0 0 12px 12px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="top">
                <h2 style="color:#2B2118;margin-top:0">Seu material chegou! 🎉</h2>
                <p style="color:#2B2118;font-size:15px;line-height:1.6">
                  Obrigado por comprar o <strong>${plano.titulo}</strong>. Seus arquivos
                  já estão prontos — é só clicar em cada botão abaixo pra baixar:
                </p>
              </td>
              <td width="80" valign="top" style="padding-left:12px">
                <img src="${SITE}/assets/mascote-email.jpg" alt="" width="72"
                     style="width:72px;height:auto;border-radius:8px" />
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0">
            ${botoesHtml}
          </table>

          <div style="background:#FDF6E8;border-radius:8px;padding:16px 18px;margin-top:8px">
            <p style="color:#2B2118;font-size:13px;line-height:1.6;margin:0">
              💡 <strong>Guarde este e-mail</strong> — os links são vitalícios, então
              dá pra voltar aqui e baixar de novo sempre que precisar, em qualquer
              aparelho.
            </p>
          </div>

          <p style="color:#6b6b6b;font-size:13px;line-height:1.6;margin-top:20px">
            Dúvidas, problema com algum arquivo, ou qualquer outra coisa? É só
            responder este e-mail que a gente te ajuda.
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px">
            <tr>
              <td style="padding-right:10px">
                <img src="${SITE}/assets/sticker-boneco-explorador-email.jpg" alt=""
                     width="56" style="width:56px;height:auto;border-radius:6px;transform:rotate(-4deg)" />
              </td>
              <td>
                <img src="${SITE}/assets/sticker-boneco-leitora-email.jpg" alt=""
                     width="56" style="width:56px;height:auto;border-radius:6px;transform:rotate(4deg)" />
              </td>
            </tr>
          </table>
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">
          <tr>
            <td width="28" valign="middle">
              <img src="${SITE}/assets/selo-conhecimento-digital-email.jpg" alt="Conhecimento Digital"
                   width="24" style="width:24px;height:24px;border-radius:50%" />
            </td>
            <td valign="middle" style="padding-left:8px">
              <p style="color:#9AA0A6;font-size:12px;margin:0">
                Conhecimento Digital · Mundo dos Blocos — material educativo independente,
                sem vínculo com Mojang, Microsoft ou Roblox Corporation.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
}
