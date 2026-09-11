// Endpoint interno para o agendador: envia SOMENTE rascunhos (Upload API).
// Não chama Direct Post e não devolve o access token ao chamador.
import { exigirBearer, obterAccessTokenTikTok, validarUrlDeFoto, validarUrlDeVideo } from "./_tiktok.js";

const VIDEO_UPLOAD_INIT_URL = "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/";
const PHOTO_UPLOAD_INIT_URL = "https://open.tiktokapis.com/v2/post/publish/content/init/";
const MAX_PHOTOS = 35;
const MAX_TITLE_UTF16 = 90;
const MAX_DESCRIPTION_UTF16 = 4000;

function textoObrigatorio(valor, nome, limite) {
  const texto = String(valor || "").trim();
  if (!texto) throw new Error(`${nome} é obrigatório.`);
  if (texto.length > limite) throw new Error(`${nome} excede o limite de ${limite} caracteres UTF-16.`);
  return texto;
}

function requisicaoDeFoto(body) {
  if (!Array.isArray(body?.photo_images) || body.photo_images.length < 1 || body.photo_images.length > MAX_PHOTOS) {
    throw new Error(`photo_images deve conter de 1 a ${MAX_PHOTOS} URLs.`);
  }
  const photoImages = body.photo_images.map(validarUrlDeFoto);
  if (new Set(photoImages).size !== photoImages.length) throw new Error("photo_images contém URLs duplicadas.");
  const title = textoObrigatorio(body?.title, "title", MAX_TITLE_UTF16);
  const description = textoObrigatorio(body?.description, "description", MAX_DESCRIPTION_UTF16);
  return {
    url: PHOTO_UPLOAD_INIT_URL,
    payload: {
      media_type: "PHOTO",
      post_mode: "MEDIA_UPLOAD",
      source_info: { source: "PULL_FROM_URL", photo_images: photoImages, photo_cover_index: 0 },
      post_info: { title, description },
    },
    mediaType: "photo",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Método não permitido" });
  }
  if (!exigirBearer(req, "TIKTOK_SCHEDULER_TOKEN")) {
    return res.status(401).json({ erro: "Não autorizado" });
  }
  try {
    const requisicao = Array.isArray(req.body?.photo_images)
      ? requisicaoDeFoto(req.body)
      : {
          url: VIDEO_UPLOAD_INIT_URL,
          payload: { source_info: { source: "PULL_FROM_URL", video_url: validarUrlDeVideo(req.body?.video_url) } },
          mediaType: "video",
        };
    const accessToken = await obterAccessTokenTikTok();
    const resposta = await fetch(requisicao.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(requisicao.payload),
    });
    const dados = await resposta.json().catch(() => ({}));
    const publishId = dados?.data?.publish_id;
    if (!resposta.ok || dados?.error?.code !== "ok" || !publishId) {
      const code = dados?.error?.code || "unknown";
      console.error("Falha no upload de rascunho TikTok:", resposta.status, code);
      return res.status(502).json({ erro: "TikTok não aceitou o rascunho.", code });
    }
    return res.status(200).json({ publish_id: publishId, state: "manual_pending", media_type: requisicao.mediaType });
  } catch (erro) {
    console.error("Falha ao enviar rascunho TikTok:", erro.message);
    return res.status(400).json({ erro: "Não foi possível enviar o rascunho TikTok.", code: "validation_or_connection_error" });
  }
}
