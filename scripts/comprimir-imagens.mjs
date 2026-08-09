// Reencoda os PNG/JPG grandes de public/assets para WebP, redimensionando
// para o maior tamanho que a página realmente exibe. Roda uma vez, localmente.
//
//     node scripts/comprimir-imagens.mjs
import { readdir, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const RAIZ = new URL("../public/assets/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// largura máxima (px) por arquivo — cobre o maior tamanho exibido na página,
// com folga para telas retina (2x)
const REGRAS = [
  { arquivos: ["completo", "portugues", "matematica"], largura: 900 },
  { arquivos: ["cartoes", "guia", "mapa", "plano"], largura: 700 },
  {
    arquivos: ["explorador", "leitora", "leitor", "construtora", "mascote"],
    largura: 700,
  },
  {
    arquivos: ["modulo-1", "modulo-2", "modulo-3", "modulo-4", "modulo-5", "modulo-6"],
    largura: 700,
  },
  { arquivos: ["cenario-mundo", "grupo-personagens", "emblema-mundo"], largura: 1600 },
];

const NAO_CONVERTER = new Set(["hero-mockup"]); // não é mais usado no código
const MANTER_FORMATO = new Set(["og"]); // precisa ficar em JPG (compatibilidade com Facebook/WhatsApp/LinkedIn)

function mantemFormato(nomeBase) {
  // *-email.*: usados no HTML do e-mail transacional — Outlook e outros
  // clientes não renderizam WebP, precisam continuar em PNG/JPG.
  return MANTER_FORMATO.has(nomeBase) || nomeBase.endsWith("-email");
}

function larguraPara(nomeBase) {
  const regra = REGRAS.find((r) => r.arquivos.includes(nomeBase));
  return regra ? regra.largura : 900;
}

async function converterArquivo(caminho, pastaRelativa = "") {
  const ext = extname(caminho).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;

  const nomeBase = basename(caminho, ext);
  if (mantemFormato(nomeBase)) return;
  if (NAO_CONVERTER.has(nomeBase)) {
    await unlink(caminho);
    console.log(`removido (não usado): ${pastaRelativa}${nomeBase}${ext}`);
    return;
  }

  const destino = caminho.replace(ext, ".webp");
  const largura = larguraPara(nomeBase);

  const antes = (await import("node:fs/promises").then((m) => m.stat(caminho))).size;

  await sharp(caminho)
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destino);

  const depois = (await import("node:fs/promises").then((m) => m.stat(destino))).size;
  await unlink(caminho);

  console.log(
    `${pastaRelativa}${nomeBase}.webp  ${(antes / 1024).toFixed(0)}KB -> ${(depois / 1024).toFixed(0)}KB`
  );
}

async function processarPasta(pasta, pastaRelativa = "") {
  const itens = await readdir(pasta, { withFileTypes: true });
  for (const item of itens) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) {
      await processarPasta(caminho, `${pastaRelativa}${item.name}/`);
    } else {
      await converterArquivo(caminho, pastaRelativa);
    }
  }
}

await processarPasta(RAIZ);
console.log("\nConcluído.");
