// Publica no Facebook (Página) e Instagram (conta profissional vinculada) via
// Graph API, usando o token do usuário de sistema criado no Business Manager.
//
//   node scripts/postar-social.mjs --imagem <url-publica> --legenda "texto" [--so-facebook] [--so-instagram]
//   node scripts/postar-social.mjs --imagem <url> --legenda "texto" --agendar "2026-08-11T12:00:00-03:00"
//
// --agendar aceita qualquer string que o Date() do JS entenda (ISO com fuso
// é o mais seguro). A Meta guarda o agendamento do lado dela — publica
// sozinha na hora certa, sem depender de nada rodando aqui depois. Regra da
// própria API: o horário tem que estar entre 10 minutos e 75 dias no futuro.
//
// A imagem PRECISA ser uma URL pública (não um caminho local) — a Meta busca
// o arquivo diretamente dos servidores dela. Para Instagram é obrigatório
// informar imagem; para Facebook, se não vier --imagem, publica só texto.
//
// Env vars necessárias (.env.local ou Vercel): META_PAGE_ID, META_IG_USER_ID,
// META_PAGE_TOKEN.
import { readFileSync } from "node:fs";

function lerEnvLocal() {
  try {
    const conteudo = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const linha of conteudo.split("\n")) {
      if (!linha.includes("=") || linha.startsWith("#")) continue;
      const i = linha.indexOf("=");
      const chave = linha.slice(0, i);
      const valor = linha.slice(i + 1).replace(/^"|"$/g, "");
      if (!process.env[chave]) process.env[chave] = valor;
    }
  } catch {
    // Sem .env.local (ex: rodando na Vercel) — segue só com process.env mesmo.
  }
}
lerEnvLocal();

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, arg, i, arr) => {
    if (arg.startsWith("--")) {
      const chave = arg.slice(2);
      const proximo = arr[i + 1];
      acc.push([chave, proximo && !proximo.startsWith("--") ? proximo : true]);
    }
    return acc;
  }, [])
);

const { META_PAGE_ID, META_IG_USER_ID, META_PAGE_TOKEN } = process.env;
if (!META_PAGE_ID || !META_IG_USER_ID || !META_PAGE_TOKEN) {
  console.error("Faltam env vars: META_PAGE_ID, META_IG_USER_ID, META_PAGE_TOKEN");
  process.exit(1);
}

async function chamarGraph(caminho, params) {
  const url = new URL(`https://graph.facebook.com/v23.0/${caminho}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const resposta = await fetch(url, { method: "POST" });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(`Graph API (${caminho}): ${JSON.stringify(dados)}`);
  return dados;
}

function validarAgendamento(agendarISO) {
  if (!agendarISO) return null;
  const quando = new Date(agendarISO);
  if (Number.isNaN(quando.getTime())) throw new Error(`--agendar inválido: ${agendarISO}`);
  const minutosNoFuturo = (quando.getTime() - Date.now()) / 60_000;
  if (minutosNoFuturo < 10) throw new Error("--agendar precisa ser pelo menos 10 minutos no futuro");
  if (minutosNoFuturo > 75 * 24 * 60) throw new Error("--agendar precisa ser no máximo 75 dias no futuro");
  return Math.floor(quando.getTime() / 1000);
}

async function postarFacebook({ imagem, legenda, unixAgendado }) {
  const params = {
    caption: legenda ?? "",
    access_token: META_PAGE_TOKEN,
    ...(imagem ? { url: imagem } : {}),
    ...(unixAgendado ? { published: "false", scheduled_publish_time: String(unixAgendado) } : {}),
  };
  if (imagem) return chamarGraph(`${META_PAGE_ID}/photos`, params);
  // Sem imagem: usa /feed com "message" em vez de "caption".
  const { caption, ...resto } = params;
  return chamarGraph(`${META_PAGE_ID}/feed`, { message: caption, ...resto });
}

async function postarFacebookStory({ imagem }) {
  if (!imagem) throw new Error("Story do Facebook exige --imagem (URL pública)");
  // Fluxo obrigatório de 2 passos (doc oficial: developers.facebook.com/docs/page-stories-api):
  // 1) sobe a foto pro Facebook sem publicar (published=false) pra virar um photo_id;
  // 2) publica esse photo_id como story em /photo_stories — /photo_stories NÃO aceita
  //    url direta, só photo_id de uma foto já enviada.
  const foto = await chamarGraph(`${META_PAGE_ID}/photos`, {
    url: imagem,
    published: "false",
    access_token: META_PAGE_TOKEN,
  });
  return chamarGraph(`${META_PAGE_ID}/photo_stories`, {
    photo_id: foto.id,
    access_token: META_PAGE_TOKEN,
  });
}

async function postarInstagram({ imagem, legenda, unixAgendado, story }) {
  if (!imagem) throw new Error("Instagram exige --imagem (URL pública)");
  if (story && unixAgendado) throw new Error("Stories não podem ser agendados pela API — só publicação imediata.");
  const container = await chamarGraph(`${META_IG_USER_ID}/media`, {
    image_url: imagem,
    access_token: META_PAGE_TOKEN,
    // Stories não têm legenda de texto via API (texto precisa estar
    // desenhado dentro da própria imagem) — "caption" só se aplica a feed.
    // A Content Publishing API NÃO suporta sticker de link/enquete/localização
    // em Stories (confirmado na doc oficial da Meta) — não existe parâmetro
    // pra isso, então nem tenta. CTA de link no Instagram só via "link na bio".
    ...(story ? { media_type: "STORIES" } : { caption: legenda ?? "" }),
    ...(unixAgendado ? { published: "false", scheduled_publish_time: String(unixAgendado) } : {}),
  });
  // Agendado: a Meta publica sozinha na hora — não chama media_publish agora.
  if (unixAgendado) return { agendado: true, container_id: container.id };
  return chamarGraph(`${META_IG_USER_ID}/media_publish`, {
    creation_id: container.id,
    access_token: META_PAGE_TOKEN,
  });
}

async function main() {
  const {
    imagem,
    legenda,
    "legenda-fb": legendaFb,
    "legenda-ig": legendaIg,
    agendar,
    story,
    "so-facebook": soFacebook,
    "so-instagram": soInstagram,
  } = args;
  const unixAgendado = validarAgendamento(agendar);
  const resultado = {};

  if (!soInstagram && story) {
    console.log("Publicando Story no Facebook...");
    resultado.facebook = await postarFacebookStory({ imagem });
  } else if (!soInstagram) {
    console.log(unixAgendado ? "Agendando no Facebook..." : "Publicando no Facebook...");
    resultado.facebook = await postarFacebook({ imagem, legenda: legendaFb ?? legenda, unixAgendado });
  }
  if (!soFacebook) {
    console.log(story ? "Publicando Story no Instagram..." : unixAgendado ? "Agendando no Instagram..." : "Publicando no Instagram...");
    resultado.instagram = await postarInstagram({ imagem, legenda: legendaIg ?? legenda, unixAgendado, story });
  }

  console.log(JSON.stringify(resultado, null, 2));
}

main().catch((erro) => {
  console.error("Falha ao publicar:", erro.message);
  process.exit(1);
});
