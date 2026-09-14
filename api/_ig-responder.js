// Responde DMs do Instagram com uma frase variada (sorteada de um banco de
// textos, sem custo de API paga), sempre terminando com a chamada para o
// site. Usado pelo webhook em api/meta-page.js — só responde quem mandou
// mensagem primeiro.

const API_VERSION = "v21.0";
const SITE_URL = "www.conhecimentodigital.net";

const RESPOSTAS = [
  `Oi! Que bom te ver por aqui 😊 Dá uma olhada no nosso site ${SITE_URL} pra conhecer nosso material.`,
  `Olá! Obrigado por chamar a gente. Se quiser conferir tudo com calma, é só entrar em ${SITE_URL}.`,
  `Oi, tudo bem? Fico feliz com seu contato! Nosso site ${SITE_URL} tem todos os detalhes do material.`,
  `Oii! Passa lá no ${SITE_URL} pra conhecer o conteúdo completo, vai gostar 🙂`,
  `Obrigado pela mensagem! Convido você a dar uma olhada em ${SITE_URL} pra ver tudo que preparamos.`,
  `Oi! Seja bem-vindo(a). Tem bastante coisa boa esperando em ${SITE_URL}, vale a pena conferir.`,
  `Olá, que legal falar com você! No site ${SITE_URL} tem todas as informações do nosso material.`,
  `Oi! Aproveita e visita ${SITE_URL} — lá você encontra tudo sobre o que a gente faz.`,
  `Que bom receber sua mensagem! Dá uma conferida em ${SITE_URL} quando puder.`,
  `Oi, tudo certo? Fica o convite pra você conhecer ${SITE_URL} com calma.`,
];

function sortearResposta() {
  return RESPOSTAS[Math.floor(Math.random() * RESPOSTAS.length)];
}

export async function gerarRespostaVariada() {
  return sortearResposta();
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
