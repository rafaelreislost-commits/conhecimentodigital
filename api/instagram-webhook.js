// Webhook do Instagram Messaging (Meta) para a página Mundo dos Blocos.
//
// GET: usado pela Meta uma única vez para verificar o endpoint
// (Developer Console → Webhooks → Verify and Save).
// POST: recebe eventos de DM em tempo real. Só respondemos mensagens
// recebidas de usuários (nunca ecoamos mensagens enviadas pela própria
// página), e cada mensagem gera uma resposta única via IA — nunca a mesma
// frase duas vezes — sempre terminando com a chamada para o site.
//
// Configuração necessária na Vercel: INSTAGRAM_VERIFY_TOKEN (escolhida por
// você, cadastrada também no painel da Meta), além de META_PAGE_TOKEN e
// META_IG_USER_ID (já existentes) e ANTHROPIC_API_KEY.
import { jaRespondeuDm } from "./_db.js";
import { enviarMensagemInstagram, gerarRespostaVariada } from "./_ig-responder.js";

export default async function handler(request, response) {
  if (request.method === "GET") {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = request.query;
    if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
      response.statusCode = 200;
      response.end(challenge);
      return;
    }
    response.statusCode = 403;
    response.end("Verificação falhou");
    return;
  }

  if (request.method !== "POST") {
    response.statusCode = 405;
    response.end("Method Not Allowed");
    return;
  }

  // Responde 200 imediatamente é o recomendado pela Meta, mas aqui
  // processamos antes de responder porque o volume é baixo (DMs de
  // seguidores, não em escala) — evita reprocessar em caso de timeout.
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
