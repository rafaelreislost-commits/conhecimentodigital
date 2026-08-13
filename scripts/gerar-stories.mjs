// Pega os fundos gerados pelo Codex (assets/social/story-N-fundo.png, sem
// texto) e desenha o texto por cima programaticamente com sharp — evita o
// risco de a IA errar acentuação/ortografia ao tentar escrever texto direto
// na imagem. Usa a fonte Baloo2 (a mesma do "CorpoNeg" dos PDFs) e painéis
// no estilo ".bloco" do site (fundo papel, borda tinta grossa, cantos
// arredondados) em vez de faixa cheia — texto sempre cabe, sem cortar.
//
//     node scripts/gerar-stories.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const RAIZ = new URL("../../assets/social/", import.meta.url);
const FONTE_URL = new URL("../../pdf/fontes/Baloo2.ttf", import.meta.url);
const L = 1080;
const A = 1920;
const MARGEM = 56;

const COR = {
  papel: "#FDF6E8",
  tinta: "#2B2118",
  grama: "#3E7A2B",
  ambar: "#F2A93B",
  ceu: "#4FA8D8",
};

function escaparXml(txt) {
  return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Estimativa de largura de caractere pro Baloo2 em negrito (~0.62x o
// font-size, na média) — o bastante pra garantir que a linha mais longa
// caiba dentro da largura do painel sem cortar.
function tamanhoQueCabe(linhas, larguraDisponivel, tamanhoMax) {
  const maiorLinha = Math.max(...linhas.map((l) => l.length));
  const tamanhoPorLargura = Math.floor(larguraDisponivel / (maiorLinha * 0.62));
  return Math.max(36, Math.min(tamanhoMax, tamanhoPorLargura));
}

function painelTitulo({ linhas, cor, corTexto, y }) {
  const larguraPainel = L - MARGEM * 2;
  const tamanho = tamanhoQueCabe(linhas, larguraPainel - 64, 92);
  const alturaLinha = tamanho * 1.15;
  const alturaPainel = alturaLinha * linhas.length + 56;

  const textos = linhas
    .map(
      (linha, i) => `
      <text x="${L / 2}" y="${y + 40 + alturaLinha * (i + 0.78)}" font-family="Baloo2"
            font-weight="700" font-size="${tamanho}" fill="${corTexto}" text-anchor="middle">
        ${escaparXml(linha)}
      </text>`
    )
    .join("");

  return {
    altura: alturaPainel,
    svg: `
      <rect x="${MARGEM}" y="${y}" width="${larguraPainel}" height="${alturaPainel}" rx="24"
            fill="${cor}" stroke="${COR.tinta}" stroke-width="6" />
      ${textos}`,
  };
}

function painelBotao({ texto, cor, corTexto, cy }) {
  const tamanho = tamanhoQueCabe([texto], L - MARGEM * 2 - 96, 52);
  const largura = Math.min(L - MARGEM * 2, texto.length * tamanho * 0.62 + 96);
  const altura = tamanho * 1.9;
  const x = (L - largura) / 2;
  const y = cy - altura / 2;

  return `
    <rect x="${x}" y="${y}" width="${largura}" height="${altura}" rx="${altura / 2}"
          fill="${cor}" stroke="${COR.tinta}" stroke-width="6" />
    <text x="${L / 2}" y="${cy + tamanho * 0.32}" font-family="Baloo2" font-weight="700"
          font-size="${tamanho}" fill="${corTexto}" text-anchor="middle">
      ${escaparXml(texto)}
    </text>`;
}

const STORIES = [
  {
    fundo: "story-1-fundo.png",
    saida: "story-1.jpg",
    titulo: ["180 ATIVIDADES", "PRA IMPRIMIR"],
    corTitulo: COR.grama,
    botao: "Arraste pra cima 👆",
    corBotao: COR.papel,
  },
  {
    fundo: "story-2-fundo.png",
    saida: "story-2.jpg",
    titulo: ["CHEGA DE TELA?"],
    corTitulo: COR.ceu,
    botao: "Ele vai pedir mais 😄",
    corBotao: COR.papel,
  },
  {
    fundo: "story-3-fundo.png",
    saida: "story-3.jpg",
    titulo: ["+5 BÔNUS INCLUSOS"],
    corTitulo: COR.ambar,
    botao: "Mapa · Cartões · Guia · Plano",
    corBotao: COR.papel,
  },
  {
    fundo: "story-4-fundo.png",
    saida: "story-4.jpg",
    titulo: ["A PARTIR DE R$ 19,90"],
    corTitulo: COR.grama,
    botao: "Acesso vitalício",
    corBotao: COR.papel,
  },
  {
    fundo: "story-5-fundo.png",
    saida: "story-5.jpg",
    titulo: ["COMECE HOJE"],
    corTitulo: COR.ambar,
    botao: "Link na bio",
    corBotao: COR.papel,
  },
];

const fonteBase64 = (await readFile(FONTE_URL)).toString("base64");
const fontFace = `
  @font-face {
    font-family: "Baloo2";
    src: url("data:font/ttf;base64,${fonteBase64}") format("truetype");
    font-weight: 700;
  }`;

for (const cfg of STORIES) {
  const fundo = await readFile(new URL(cfg.fundo, RAIZ));

  const titulo = painelTitulo({ linhas: cfg.titulo, cor: COR.papel, corTexto: cfg.corTitulo, y: 90 });
  const botaoSvg = painelBotao({
    texto: cfg.botao,
    cor: COR.tinta,
    corTexto: cfg.corBotao,
    cy: A - 160,
  });

  const svg = `
    <svg width="${L}" height="${A}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>${fontFace}</style>
        <linearGradient id="sombraBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${COR.tinta}" stop-opacity="0" />
          <stop offset="100%" stop-color="${COR.tinta}" stop-opacity="0.55" />
        </linearGradient>
      </defs>
      <rect x="0" y="${A - 340}" width="${L}" height="340" fill="url(#sombraBase)" />
      ${titulo.svg}
      ${botaoSvg}
    </svg>`;

  const resultado = await sharp(fundo)
    .resize(L, A, { fit: "cover" })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    // JPEG, não PNG: Stories do Facebook têm limite de 1MB pra PNG (10MB pra
    // outros formatos) — PNG comprimido ainda passava desse teto facilmente.
    .jpeg({ quality: 88 })
    .toBuffer();

  await writeFile(new URL(cfg.saida, RAIZ), resultado);
  console.log(`${cfg.saida} pronto`);
}
