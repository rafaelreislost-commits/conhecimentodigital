import { exigirBearer, obterAccessTokenTikTok } from "./_tiktok.js";

const STATUS_URL = "https://open.tiktokapis.com/v2/post/publish/status/fetch/";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });
  if (!exigirBearer(req, "TIKTOK_SCHEDULER_TOKEN")) return res.status(401).json({ erro: "Não autorizado" });
  const publishId = String(req.body?.publish_id || "").trim();
  if (!publishId) return res.status(400).json({ erro: "publish_id é obrigatório" });
  try {
    const token = await obterAccessTokenTikTok();
    const response = await fetch(STATUS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ publish_id: publishId }),
    });
    const data = await response.json().catch(() => ({}));
    return res.status(response.ok ? 200 : 502).json(data);
  } catch (error) {
    console.error("Falha ao consultar status TikTok:", error.message);
    return res.status(502).json({ erro: "Não foi possível consultar o TikTok" });
  }
}
