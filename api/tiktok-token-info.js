// Endpoint interno usado pelo scheduler/post-tiktok-video.js pra ler o
// refresh_token salvo (o script roda fora da Vercel, entao nao pode importar
// _db.js diretamente — ele fala com o Postgres via essa rota HTTP).
// Protegido pelo mesmo ADMIN_TOKEN do /api/clientes.
import { pegarTokenTiktok } from "./_db.js";

export default async function handler(req, res) {
  const senha = process.env.ADMIN_TOKEN;
  if (!senha || req.query.chave !== senha) {
    return res.status(401).json({ error: "acesso negado" });
  }

  try {
    const token = await pegarTokenTiktok();
    if (!token) {
      return res.status(404).json({ error: "nenhuma conta TikTok conectada" });
    }
    return res.status(200).json({
      open_id: token.open_id,
      refresh_token: token.refresh_token,
      refresh_token_expires_at: token.refresh_token_expires_at,
    });
  } catch (erro) {
    console.error("Erro lendo token TikTok:", erro);
    return res.status(500).json({ error: "erro no banco" });
  }
}
