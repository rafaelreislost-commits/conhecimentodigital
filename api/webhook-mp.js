// Vercel Serverless Function — recebida pelo Mercado Pago quando o status de
// um pagamento muda. Se aprovado, manda por e-mail os links de download do
// material comprado, via SMTP (Outlook) — Resend fica só como fallback
// caso SMTP_USER/SMTP_PASS não estejam configurados, mas não deve ser usado
// em produção com o domínio de teste onboarding@resend.dev: ele só entrega
// pra caixa da própria conta Resend, nunca pra cliente real (foi assim que
// uma venda aprovada ficou sem o material chegar).
//
// Configurar essa URL no Mercado Pago não é necessário manualmente: ela é
// enviada automaticamente em cada preferência criada (ver notification_url
// em criar-pagamento.js). Env vars necessárias na Vercel:
//   MP_ACCESS_TOKEN, SMTP_USER, SMTP_PASS, EMAIL_REMETENTE
import { MercadoPagoConfig, Payment } from "mercadopago";
import { PLANOS, validarArquivos } from "./_planos.js";
import { registrarVenda } from "./_db.js";
import { enviarPurchaseMeta } from "./_meta-capi.js";
import { enviarEmailComMateriais, SITE } from "./_email-entrega.js";

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
    // pagamento.payer?.email costuma vir mascarado ("XXXXXXXXXXX") pela
    // política de privacidade do Mercado Pago — o valor confiável é o que
    // a gente mesmo capturou no site e gravou em metadata antes do
    // redirect (ver criar-pagamento.js). payer.email fica só de fallback
    // para pagamentos antigos, de antes dessa mudança.
    const emailCliente = pagamento.metadata?.email_comprador || pagamento.payer?.email;
    const emailValido = typeof emailCliente === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente);

    if (!plano || !emailValido) {
      console.error("Pagamento aprovado sem plano ou e-mail válido", {
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

    // Registro pro relatório de clientes — não deixa a falta de banco
    // configurado quebrar a entrega do material (isso já aconteceu, é o
    // que importa de verdade); só loga o erro.
    try {
      const nome = [pagamento.payer?.first_name, pagamento.payer?.last_name]
        .filter(Boolean)
        .join(" ");
      await registrarVenda({
        paymentId: String(paymentId),
        plano: planoId,
        email: emailCliente,
        nomePagador: nome || null,
        valor: pagamento.transaction_amount ?? plano.preco,
        metodoPagamento: pagamento.payment_type_id || pagamento.payment_method_id || null,
        status: pagamento.status,
      });
    } catch (erroDb) {
      console.error("Falha ao registrar venda no banco (não afeta a entrega):", erroDb);
    }

    // Evento Purchase server-side pra Meta (API de Conversões). event_id = id do
    // pagamento, o mesmo que o Pixel do navegador usa em /obrigado, pra Meta
    // deduplicar. Falha aqui não afeta a entrega do material — só loga.
    try {
      const md = pagamento.metadata || {};
      const telefone = [pagamento.payer?.phone?.area_code, pagamento.payer?.phone?.number]
        .filter(Boolean)
        .join("");
      await enviarPurchaseMeta({
        email: emailCliente,
        phone: telefone || undefined,
        firstName: pagamento.payer?.first_name || undefined,
        lastName: pagamento.payer?.last_name || undefined,
        // id estável do pagador no MP (sempre presente); CPF como fallback.
        externalId:
          (pagamento.payer?.id && String(pagamento.payer.id)) ||
          pagamento.payer?.identification?.number ||
          undefined,
        // Capturados no /api/criar-pagamento (request do navegador do cliente).
        clientIp: md.client_ip || undefined,
        clientUserAgent: md.client_ua || undefined,
        fbp: md.fbp || undefined,
        fbc: md.fbc || undefined,
        valor: pagamento.transaction_amount ?? plano.preco,
        eventId: paymentId,
        eventSourceUrl: `${SITE}/obrigado`,
      });
    } catch (erroCapi) {
      console.error("Falha ao enviar Purchase pra Meta CAPI (não afeta a entrega):", erroCapi);
    }

    return res.status(200).end();
  } catch (erro) {
    console.error("Erro processando webhook Mercado Pago:", erro);
    // Responde 200 mesmo assim: um 4xx/5xx faz o MP reenviar o mesmo evento
    // várias vezes, o que pode gerar e-mails duplicados quando o problema é
    // no nosso lado (ex: Resend fora do ar) e não algo que um retry resolve.
    return res.status(200).end();
  }
}

