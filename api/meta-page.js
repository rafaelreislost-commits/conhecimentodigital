// Duas responsabilidades no mesmo endpoint pra não estourar o limite de
// Serverless Functions do plano Hobby (12):
//
// 1. GET simples (sem hub.mode) — usado pelo rewrite de "/" pra servir o
//    shell da página pra crawlers da Meta (link preview, etc).
// 2. GET com hub.mode / POST — webhook do Instagram Messaging. Ver
//    api/_ig-responder.js para a lógica de resposta às DMs.
import { jaRespondeuDm } from "./_db.js";
import { enviarMensagemInstagram, gerarRespostaVariada } from "./_ig-responder.js";

const SITE_URL = "https://conhecimentodigital.net/";

async function servirShellDaPagina(response) {
  const source = await fetch(`${SITE_URL}app-shell.html?_origin=1`, {
    headers: { "User-Agent": "ConhecimentoDigital-Meta-Shell/1.0" },
  });

  if (!source.ok) {
    response.statusCode = 502;
    response.end("Unable to load page shell");
    return;
  }

  const html = Buffer.from(await source.arrayBuffer());

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Content-Length", String(html.length));
  response.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  response.end(html);
}

async function verificarWebhookInstagram(request, response) {
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = request.query;
  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    response.statusCode = 200;
    response.end(challenge);
    return;
  }
  response.statusCode = 403;
  response.end("Verificação falhou");
}

async function receberEventosInstagram(request, response) {
  try {
    const body = request.body || {};
    const eventos = body.entry || [];

    for (const entrada of eventos) {
      const mensagens = entrada.messaging || [];
      for (const evento of mensagens) {
        const remetenteId = evento.sender?.id;
        const mensagem = evento.message;

        // Ignora eco de mensagens enviadas pela própria página e eventos sem texto.
        if (!remetenteId || !mensagem || mensagem.is_echo || !mensagem.mid) continue;

        const jaProcessada = await jaRespondeuDm({ messageId: mensagem.mid, remetenteId });
        if (jaProcessada) continue;

        const texto = await gerarRespostaVariada(mensagem.text);
        await enviarMensagemInstagram({ destinatarioId: remetenteId, texto });
      }
    }

    response.statusCode = 200;
    response.end("EVENT_RECEIVED");
  } catch (erro) {
    console.error("Erro no webhook do Instagram:", erro);
    response.statusCode = 200; // evita reenvio agressivo da Meta
    response.end("EVENT_RECEIVED");
  }
}

export default async function handler(request, response) {
  if (request.method === "GET" && request.query["hub.mode"]) {
    return verificarWebhookInstagram(request, response);
  }
  if (request.method === "POST") {
    return receberEventosInstagram(request, response);
  }
  return servirShellDaPagina(response);
}
