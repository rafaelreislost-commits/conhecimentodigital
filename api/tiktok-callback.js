// Callback do OAuth do TikTok. O TikTok redireciona pra cá com ?code=...
// depois que a conta autoriza o app. Troca o code por access/refresh token
// e salva no Postgres (tabela tiktok_tokens) pra o poster automático usar depois.
import { salvarTokenTiktok } from "./_db.js";

function lerCookie(req, nome) {
  const raw = req.headers.cookie || "";
  const m = raw.match(new RegExp(`(?:^|;\\s*)${nome}=([^;]+)`));
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res
      .status(400)
      .send(`Autorização do TikTok falhou: ${error} — ${error_description || ""}`);
  }
  if (!code) {
    return res.status(400).send("Callback do TikTok sem 'code'.");
  }

  const stateEsperado = lerCookie(req, "tt_state");
  if (!stateEsperado || state !== stateEsperado) {
    return res.status(400).send("State inválido — inicie o login de novo em /api/tiktok-login.");
  }

  const codeVerifier = lerCookie(req, "tt_verifier");
  if (!codeVerifier) {
    return res.status(400).send("Sessão de login expirada — inicie de novo em /api/tiktok-login.");
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const baseUrl = `https://${req.headers.host}`;

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: `${baseUrl}/api/tiktok-callback`,
    code_verifier: codeVerifier,
  });

  let dados;
  try {
    const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });
    dados = await r.json();
    if (!r.ok || !dados.access_token) {
      console.error("Erro trocando code por token TikTok:", dados);
      return res.status(502).send(`Erro ao trocar código por token: ${JSON.stringify(dados)}`);
    }
  } catch (erro) {
    console.error("Erro de rede trocando token TikTok:", erro);
    return res.status(502).send("Erro de rede ao contatar o TikTok.");
  }

  try {
    await salvarTokenTiktok({
      openId: dados.open_id,
      accessToken: dados.access_token,
      refreshToken: dados.refresh_token,
      expiresIn: dados.expires_in,
      refreshExpiresIn: dados.refresh_expires_in,
    });
  } catch (erro) {
    console.error("Erro salvando token TikTok no banco:", erro);
    return res.status(500).send("Token obtido, mas falhou ao salvar no banco.");
  }

  // Limpa os cookies temporários do PKCE.
  res.setHeader("Set-Cookie", [
    "tt_verifier=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    "tt_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  ]);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`
    <!doctype html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8" /><title>TikTok conectado</title></head>
    <body style="font-family: system-ui, sans-serif; padding: 40px; text-align: center;">
      <h1>✅ Conta do TikTok conectada!</h1>
      <p>open_id: ${dados.open_id}</p>
      <p>Já pode fechar esta aba — o poster automático agora consegue publicar nessa conta.</p>
    </body>
    </html>
  `);
}
