// Responde DMs do Instagram com uma variação de texto gerada por IA, sempre
// terminando com a chamada para o site. Usado pelo webhook em
// api/instagram-webhook.js — só responde quem mandou mensagem primeiro.

const API_VERSION = "v21.0";
const SITE_URL = "www.conhecimentodigital.net";

const INSTRUCOES = `Você responde mensagens diretas do Instagram da página "Mundo dos Blocos"
(conteúdo educativo infantil). Alguém acabou de mandar uma mensagem pra página.

Escreva uma resposta curta (1-3 frases), calorosa e natural em português do Brasil,
agradecendo o contato e convidando a pessoa a conhecer o site ${SITE_URL}.
Varie o tom e as palavras a cada resposta — nunca repita a mesma frase.
Não use emojis em excesso (no máximo 1-2). Não invente promessas ou promoções.
Sempre inclua o link ${SITE_URL} de forma natural no texto.
Responda APENAS com o texto da mensagem, sem aspas, sem explicações.`;

export async function gerarRespostaVariada(mensagemRecebida) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return `Oi! Que bom te ver por aqui 😊 Dá uma olhada no nosso site ${SITE_URL} pra conhecer nosso material.`;
  }

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: INSTRUCOES,
      messages: [
        { role: "user", content: mensagemRecebida?.slice(0, 500) || "(mensagem sem texto)" },
      ],
    }),
  });

  if (!resp.ok) {
    throw new Error(`Anthropic API recusou (status ${resp.status}): ${await resp.text()}`);
  }

  const data = await resp.json();
  return data.content?.[0]?.text?.trim() || `Oi! Conhece nosso site? ${SITE_URL}`;
}

export async function enviarMensagemInstagram({ destinatarioId, texto }) {
  const token = process.env.META_PAGE_TOKEN;
  const igUserId = process.env.META_IG_USER_ID;
  if (!token || !igUserId) throw new Error("META_PAGE_TOKEN ou META_IG_USER_ID não configurados");

  const resp = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${igUserId}/messages?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: destinatarioId },
        message: { text: texto },
      }),
    }
  );

  if (!resp.ok) {
    throw new Error(`Instagram Send API recusou (status ${resp.status}): ${await resp.text()}`);
  }

  return resp.json();
}
