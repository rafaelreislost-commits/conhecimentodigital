// Proxy simples: retransmite um vídeo hospedado no Vercel Blob a partir do
// domínio verificado (conhecimentodigital.net), pra uso com APIs que exigem
// URL de um domínio já verificado (ex: TikTok PULL_FROM_URL).
const HOSTS_PERMITIDOS = ["public.blob.vercel-storage.com"];

export default async function handler(req, res) {
  const src = req.query?.src;
  if (!src || typeof src !== "string") {
    return res.status(400).json({ erro: "Parâmetro src é obrigatório." });
  }
  let url;
  try {
    url = new URL(src);
  } catch {
    return res.status(400).json({ erro: "src inválido." });
  }
  if (url.protocol !== "https:" || !HOSTS_PERMITIDOS.some((h) => url.host.endsWith(h))) {
    return res.status(400).json({ erro: "Origem não permitida." });
  }
  const upstream = await fetch(url.toString());
  if (!upstream.ok || !upstream.body) {
    return res.status(502).json({ erro: "Falha ao buscar o vídeo de origem." });
  }
  res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
  const len = upstream.headers.get("content-length");
  if (len) res.setHeader("Content-Length", len);
  res.setHeader("Cache-Control", "public, max-age=3600");
  const reader = upstream.body.getReader();
  res.status(200);
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  } finally {
    res.end();
  }
}
