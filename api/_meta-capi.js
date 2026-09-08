// Envia eventos server-side para a API de Conversões da Meta.
//
// Complementa o Pixel do navegador (src/lib/pixel.js + src/paginas/Obrigado.jsx):
// o mesmo event_id (id do pagamento no Mercado Pago) é enviado pelos dois lados
// para a Meta deduplicar e não contar a venda duas vezes.
//
// É no-op enquanto META_CAPI_TOKEN não estiver configurado na Vercel, então o
// deploy não quebra antes do token existir.
//
// Env vars: META_CAPI_TOKEN (obrigatória p/ ativar), META_PIXEL_ID (opcional,
// tem fallback pro id do Pixel "Conhecimento Digital - Site").
import crypto from "node:crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "2983377001998744";
const API_VERSION = "v21.0";

function hash(valor) {
  if (!valor) return undefined;
  return crypto.createHash("sha256").update(String(valor).trim().toLowerCase()).digest("hex");
}

function soDigitos(valor) {
  return String(valor || "").replace(/\D/g, "");
}

/**
 * Dispara o evento Purchase na API de Conversões.
 * Lança exceção se a Meta recusar — quem chama decide se isso é fatal
 * (no webhook NÃO é: a entrega do material vem primeiro).
 *
 * Quanto mais campos de `user_data` forem preenchidos, melhor a "qualidade
 * da correspondência" do evento no Events Manager e a atribuição de anúncio.
 * em/ph/fn/ln/external_id vão com hash SHA-256; ip/user_agent/fbp/fbc NÃO
 * podem ser hasheados (a Meta precisa do valor cru).
 */
export async function enviarPurchaseMeta({
  email,
  phone,
  firstName,
  lastName,
  externalId,
  clientIp,
  clientUserAgent,
  fbp,
  fbc,
  valor,
  eventId,
  eventSourceUrl,
}) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return; // ainda não configurado — sai sem fazer nada

  const userData = {};
  const emailHash = hash(email);
  if (emailHash) userData.em = [emailHash];

  if (phone) {
    let tel = soDigitos(phone);
    // Padrão E.164 sem "+": telefone BR sem DDI entra com 55 na frente pra
    // a Meta conseguir casar.
    if (tel.length && tel.length <= 11 && !tel.startsWith("55")) tel = `55${tel}`;
    if (tel) userData.ph = [hash(tel)];
  }
  if (firstName) userData.fn = [hash(firstName)];
  if (lastName) userData.ln = [hash(lastName)];
  if (externalId) userData.external_id = [hash(externalId)];
  if (clientIp) userData.client_ip_address = clientIp;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId ? String(eventId) : undefined,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: { currency: "BRL", value: Number(valor) },
      },
    ],
  };

  const resp = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Meta CAPI recusou o evento (status ${resp.status}): ${txt}`);
  }
}
