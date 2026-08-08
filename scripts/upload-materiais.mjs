// Sobe os PDFs finais (pdf/saida/*.pdf) para o Vercel Blob e grava as URLs
// públicas resultantes em api/_materiais-urls.json. Rodar sempre que um PDF
// for atualizado.
//
// Precisa da env var BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob → .env.local
// tab, ou `vercel env pull` depois de criar o store e linkar o projeto).
//
//     node scripts/upload-materiais.mjs
import { readFile, writeFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const RAIZ_PDF = new URL("../../pdf/saida/", import.meta.url);
const ARQUIVO_URLS = new URL("../api/_materiais-urls.json", import.meta.url);

const MATERIAIS = [
  { chave: "portugues", arquivo: "Portugues-no-Mundo-dos-Blocos.pdf" },
  { chave: "matematica", arquivo: "Matematica-no-Mundo-dos-Blocos.pdf" },
  { chave: "mapa", arquivo: "Mapa-de-Progresso-do-Aventureiro.pdf" },
  { chave: "cards", arquivo: "Cards-de-Recompensa.pdf" },
  { chave: "guia", arquivo: "Guia-Rapido-para-os-Pais.pdf" },
  { chave: "plano", arquivo: "Plano-de-Estudos-Semanal.pdf" },
  { chave: "bonecos", arquivo: "Bonecos-de-Papel.pdf" },
];

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "Faltou BLOB_READ_WRITE_TOKEN. Pegue em Vercel → seu projeto → Storage → (seu Blob store) → .env.local, " +
      "ou rode `vercel env pull .env.local` na pasta landing/ depois de criar o store."
  );
  process.exit(1);
}

const urls = JSON.parse(await readFile(ARQUIVO_URLS, "utf-8"));

for (const { chave, arquivo } of MATERIAIS) {
  const caminho = new URL(arquivo, RAIZ_PDF);
  const conteudo = await readFile(caminho);
  const resultado = await put(`materiais/${arquivo}`, conteudo, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/pdf",
    // Força o token do Blob store em vez do OIDC token da Vercel CLI, que
    // vem escopado ao ambiente "development" e não tem permissão de escrita.
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  urls[chave] = resultado.url;
  console.log(`${chave} -> ${resultado.url}`);
}

await writeFile(ARQUIVO_URLS, JSON.stringify(urls, null, 2) + "\n");
console.log("\napi/_materiais-urls.json atualizado.");
