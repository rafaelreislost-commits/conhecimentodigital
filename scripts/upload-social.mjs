// Sobe as artes de post (assets/social/*.png) para o Vercel Blob e imprime
// as URLs públicas — usadas pelo postar-social.mjs.
//
//     node scripts/upload-social.mjs
import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const RAIZ_SOCIAL = new URL("../../assets/social/", import.meta.url);

const ARQUIVOS = [
  "post-1-hero.png",
  "post-2-telas.png",
  "post-3-bonus.png",
  "post-4-comemoracao.png",
  "post-5-familia.png",
  "story-1.jpg",
  "story-2.jpg",
  "story-3.jpg",
  "story-4.jpg",
  "story-5.jpg",
];

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Faltou BLOB_READ_WRITE_TOKEN no ambiente.");
  process.exit(1);
}

const urls = {};
for (const arquivo of ARQUIVOS) {
  const conteudo = await readFile(new URL(arquivo, RAIZ_SOCIAL));
  const contentType = arquivo.endsWith(".jpg") || arquivo.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  const resultado = await put(`social/${arquivo}`, conteudo, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  urls[arquivo] = resultado.url;
  console.log(`${arquivo} -> ${resultado.url}`);
}

console.log(JSON.stringify(urls, null, 2));
