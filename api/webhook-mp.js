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

async function enviarEmailComMateriais({ email, plano }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const remetente = process.env.EMAIL_REMETENTE || "Mundo dos Blocos <onboarding@resend.dev>";

  const listaHtml = plano.arquivos
    .map((a) => `<li style="margin-bottom:8px"><a href="${a.url}">${a.nome}</a></li>`)
    .join("");

  await resend.emails.send({
    from: remetente,
    to: email,
    subject: "Seu material chegou! 🎮 Mundo dos Blocos",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h1 style="color:#2B2118">Seu material chegou!</h1>
        <p>Obrigado por comprar o <strong>${plano.titulo}</strong>. Os arquivos estão prontos pra baixar e imprimir:</p>
        <ul>${listaHtml}</ul>
        <p style="color:#666;font-size:14px">
          Guarde este e-mail — os links não expiram. Qualquer dúvida, é só responder esta mensagem.
        </p>
      </div>
    `,
  });
}
