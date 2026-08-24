// Inicia o login OAuth do TikTok (Login Kit, com PKCE).
// Acesse https://SEU-SITE.vercel.app/api/tiktok-login pra conectar/reconectar
// a conta do TikTok que vai receber os posts automáticos.
import crypto from "node:crypto";

function base64url(buf) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function handler(req, res) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const baseUrl = `https://${req.headers.host}`;
  if (!clientKey) {
    return res.status(500).send("TIKTOK_CLIENT_KEY não configurada.");
  }

  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );
  const state = base64url(crypto.randomBytes(16));

  // Cookie curto e httpOnly só pra sobreviver ao redirect de ida e volta do TikTok.
  res.setHeader("Set-Cookie", [
    `tt_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `tt_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ]);

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: "user.info.basic,video.upload",
    response_type: "code",
    redirect_uri: `${baseUrl}/api/tiktok-callback`,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.writeHead(302, {
    Location: `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`,
  });
  res.end();
}
