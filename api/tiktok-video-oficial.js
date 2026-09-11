// Serve o vídeo oficial do Aventura na Fé (armazenado no Vercel Blob) a partir
// do domínio verificado no TikTok, sem expor a origem real na URL — a API do
// TikTok parece rejeitar PULL_FROM_URL quando a query string contém outro
// domínio (ownership_unverified mesmo com o domínio principal verificado).
const ORIGEM =
  "https://4wsbsii5w3b9mlkd.public.blob.vercel-storage.com/videos/aventura-na-fe-oficial-1789090737-eJSkTrvx5bTzAdpIkXwzdjSjgkxdAK.mp4";

export default async function handler(_req, res) {
  const upstream = await fetch(ORIGEM);
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
