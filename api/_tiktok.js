// Infraestrutura server-side para OAuth e Upload API do TikTok.
// Nenhum token de usuário, refresh token ou client secret deve ir ao navegador
// nem ao agendador local.
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { sql } from "@vercel/postgres";

const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_AUTHORIZE_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TOKEN_REFRESH_MARGIN_MS = 10 * 60 * 1000;

let tabelasProntas;

function envObrigatoria(nome) {
  const valor = process.env[nome];
  if (!valor) throw new Error(`${nome} não configurada no servidor.`);
  return valor;
}

function chaveCriptografia() {
  const chave = Buffer.from(envObrigatoria("TIKTOK_TOKEN_ENCRYPTION_KEY"), "base64");
  if (chave.length !== 32) {
    throw new Error("TIKTOK_TOKEN_ENCRYPTION_KEY deve ser uma chave base64 de 32 bytes.");
  }
  return chave;
}

function criptografar(valor) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", chaveCriptografia(), iv);
  const conteudo = Buffer.concat([cipher.update(valor, "utf8"), cipher.final()]);
  return [iv, conteudo, cipher.getAuthTag()].map((parte) => parte.toString("base64url")).join(".");
}

function descriptografar(valor) {
  const partes = String(valor).split(".").map((parte) => Buffer.from(parte, "base64url"));
  if (partes.length !== 3 || partes.some((parte) => parte.length === 0)) {
    throw new Error("Credencial TikTok armazenada em formato inválido.");
  }
  const [iv, conteudo, tag] = partes;
  const decipher = createDecipheriv("aes-256-gcm", chaveCriptografia(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(conteudo), decipher.final()]).toString("utf8");
}

function hashEstado(estado) {
  return createHash("sha256").update(estado).digest("hex");
}

function temEscopoVideoUpload(escopos) {
  return String(escopos || "").split(/[\s,]+/).includes("video.upload");
}

function expiraEm(segundos) {
  const valor = Number(segundos);
  if (!Number.isFinite(valor) || valor <= 0) throw new Error("Resposta TikTok sem expiração válida.");
  return new Date(Date.now() + valor * 1000);
}

function compararSegredo(recebido, esperado) {
  if (!recebido || !esperado) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function exigirBearer(req, nomeDaVariavel) {
  const cabecalho = req.headers.authorization || "";
  const recebido = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : "";
  return compararSegredo(recebido, process.env[nomeDaVariavel]);
}

export function configuracaoOAuth() {
  return {
    clientKey: envObrigatoria("TIKTOK_CLIENT_KEY"),
    clientSecret: envObrigatoria("TIKTOK_CLIENT_SECRET"),
    redirectUri: envObrigatoria("TIKTOK_REDIRECT_URI"),
  };
}

export async function garantirTabelasTikTok() {
  if (!tabelasProntas) {
    tabelasProntas = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS tiktok_oauth_states (
          state_hash TEXT PRIMARY KEY,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS tiktok_credentials (
          id SMALLINT PRIMARY KEY CHECK (id = 1),
          open_id TEXT NOT NULL,
          access_token_ciphertext TEXT NOT NULL,
          refresh_token_ciphertext TEXT NOT NULL,
          scope TEXT NOT NULL,
          token_type TEXT NOT NULL,
          access_expires_at TIMESTAMPTZ NOT NULL,
          refresh_expires_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return tabelasProntas;
}

export async function criarAutorizacaoTikTok() {
  const { clientKey, redirectUri } = configuracaoOAuth();
  await garantirTabelasTikTok();
  const estado = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await sql`DELETE FROM tiktok_oauth_states WHERE expires_at <= now()`;
  await sql`
    INSERT INTO tiktok_oauth_states (state_hash, expires_at)
    VALUES (${hashEstado(estado)}, ${expiresAt.toISOString()})
  `;

  const url = new URL(TIKTOK_AUTHORIZE_URL);
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("response_type", "code");
  // user.info.basic e o escopo-base do Login Kit web; video.upload permite
  // somente o envio de rascunhos para o inbox da conta criadora.
  url.searchParams.set("scope", "user.info.basic,video.upload");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", estado);
  return url.toString();
}

export async function consumirEstadoTikTok(estado) {
  if (!estado || typeof estado !== "string") return false;
  await garantirTabelasTikTok();
  const { rows } = await sql`
    DELETE FROM tiktok_oauth_states
    WHERE state_hash = ${hashEstado(estado)} AND expires_at > now()
    RETURNING state_hash
  `;
  return rows.length === 1;
}

async function chamarTokenTikTok(params) {
  const resposta = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams(params),
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok || dados.error) {
    throw new Error("TikTok recusou a autorização. Refaça a conexão da conta criadora.");
  }
  return dados;
}

async function salvarCredenciais(dados, anterior = null) {
  if (!dados.access_token || !dados.refresh_token) {
    throw new Error("Resposta TikTok não contém credenciais completas.");
  }
  const escopos = dados.scope || anterior?.scope || "";
  if (!temEscopoVideoUpload(escopos)) {
    throw new Error("A conta criadora não autorizou o escopo video.upload.");
  }
  const openId = dados.open_id || anterior?.open_id;
  if (!openId) throw new Error("Resposta TikTok sem identificador da conta criadora.");
  const accessExpiresAt = expiraEm(dados.expires_in);
  const refreshExpiresAt = expiraEm(dados.refresh_expires_in);

  await garantirTabelasTikTok();
  await sql`
    INSERT INTO tiktok_credentials (
      id, open_id, access_token_ciphertext, refresh_token_ciphertext, scope,
      token_type, access_expires_at, refresh_expires_at, updated_at
    ) VALUES (
      1, ${openId}, ${criptografar(dados.access_token)}, ${criptografar(dados.refresh_token)},
      ${escopos}, ${dados.token_type || "Bearer"}, ${accessExpiresAt.toISOString()},
      ${refreshExpiresAt.toISOString()}, now()
    )
    ON CONFLICT (id) DO UPDATE SET
      open_id = EXCLUDED.open_id,
      access_token_ciphertext = EXCLUDED.access_token_ciphertext,
      refresh_token_ciphertext = EXCLUDED.refresh_token_ciphertext,
      scope = EXCLUDED.scope,
      token_type = EXCLUDED.token_type,
      access_expires_at = EXCLUDED.access_expires_at,
      refresh_expires_at = EXCLUDED.refresh_expires_at,
      updated_at = now()
  `;
}

export async function trocarCodigoPorCredenciais(codigo) {
  const { clientKey, clientSecret, redirectUri } = configuracaoOAuth();
  const dados = await chamarTokenTikTok({
    client_key: clientKey,
    client_secret: clientSecret,
    code: codigo,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  await salvarCredenciais(dados);
}

async function carregarCredenciais() {
  await garantirTabelasTikTok();
  const { rows } = await sql`SELECT * FROM tiktok_credentials WHERE id = 1`;
  return rows[0] || null;
}

export async function obterAccessTokenTikTok() {
  const atual = await carregarCredenciais();
  if (!atual) throw new Error("TikTok não conectado. Inicie o OAuth da conta criadora.");
  if (!temEscopoVideoUpload(atual.scope)) {
    throw new Error("A conexão TikTok atual não possui video.upload. Reconecte a conta criadora.");
  }
  const accessExpiresAt = new Date(atual.access_expires_at).getTime();
  if (Number.isFinite(accessExpiresAt) && accessExpiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS) {
    return descriptografar(atual.access_token_ciphertext);
  }
  const refreshExpiresAt = new Date(atual.refresh_expires_at).getTime();
  if (!Number.isFinite(refreshExpiresAt) || refreshExpiresAt <= Date.now()) {
    throw new Error("A autorização TikTok expirou. Reconecte a conta criadora.");
  }
  const { clientKey, clientSecret } = configuracaoOAuth();
  const dados = await chamarTokenTikTok({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: descriptografar(atual.refresh_token_ciphertext),
  });
  await salvarCredenciais(dados, atual);
  return dados.access_token;
}

function hostsDeMidiaPermitidos() {
  // Mantemos o nome histórico da variável para não exigir uma migração de
  // segredo no deploy. O mesmo domínio verificado no TikTok serve a vídeos e
  // fotos baixados pela Upload API.
  return (process.env.TIKTOK_ALLOWED_MEDIA_HOST || process.env.TIKTOK_ALLOWED_VIDEO_HOST || "conhecimentodigital.net,conhecimentodigital.vercel.app")
    .split(",").map((host) => host.trim()).filter(Boolean);
}

function validarUrlDeMidia(mediaUrl, rotulo) {
  let url;
  try {
    url = new URL(mediaUrl);
  } catch {
    throw new Error(`URL de ${rotulo} inválida.`);
  }
  if (url.protocol !== "https:") throw new Error(`A ${rotulo} deve usar HTTPS.`);
  if (!hostsDeMidiaPermitidos().includes(url.host)) throw new Error(`A origem da ${rotulo} não é permitida.`);
  return url.toString();
}

export function validarUrlDeVideo(videoUrl) {
  return validarUrlDeMidia(videoUrl, "vídeo");
}

export function validarUrlDeFoto(photoUrl) {
  const url = new URL(validarUrlDeMidia(photoUrl, "foto"));
  if (!/\.(?:jpe?g|png|webp)$/i.test(url.pathname)) {
    throw new Error("Formato de foto não permitido; use JPEG, PNG ou WebP.");
  }
  return url.toString();
}
