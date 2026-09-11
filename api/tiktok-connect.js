// Gera uma URL de autorização TikTok para uso administrativo local.
// É protegida por TIKTOK_OAUTH_SETUP_TOKEN e não entrega tokens ao cliente.
import { criarAutorizacaoTikTok, exigirBearer } from "./_tiktok.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Método não permitido" });
  }
  if (!exigirBearer(req, "TIKTOK_OAUTH_SETUP_TOKEN")) {
    return res.status(401).json({ erro: "Não autorizado" });
  }
  try {
    return res.status(200).json({ authorization_url: await criarAutorizacaoTikTok() });
  } catch (erro) {
    console.error("Falha ao iniciar OAuth TikTok:", erro.message);
    return res.status(500).json({ erro: "Não foi possível iniciar a conexão TikTok." });
  }
}
