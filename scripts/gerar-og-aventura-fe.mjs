// Gera a imagem OG (1200x630) da página /aventura-na-fe a partir da capa.
import sharp from "sharp";

const W = 1200, H = 630;
const capaPath = "public/assets/aventura-na-fe/af-00-capa.png";
const out = "public/assets/og-aventura-na-fe.jpg";

// Fundo: capa em cover, desfocada e escurecida (tons dourados da arte).
const fundo = await sharp(capaPath)
  .resize(W, H, { fit: "cover", position: "top" })
  .blur(28)
  .modulate({ brightness: 0.55, saturation: 1.1 })
  .toBuffer();

// Card da capa (nítido) à direita.
const cardH = 540;
const card = await sharp(capaPath)
  .resize({ height: cardH })
  .extend({ top: 6, bottom: 6, left: 6, right: 6, background: "#ffffff" })
  .toBuffer();
const cardMeta = await sharp(card).metadata();

// Texto à esquerda (SVG).
const texto = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .t { font-family: Arial, Helvetica, sans-serif; fill:#ffffff; font-weight:800; }
    .s { font-family: Arial, Helvetica, sans-serif; fill:#F2E9DA; font-weight:600; }
    .u { font-family: Arial, Helvetica, sans-serif; fill:#FFD873; font-weight:700; letter-spacing:1px; }
  </style>
  <text x="70" y="250" class="t" font-size="72">Aventura</text>
  <text x="70" y="330" class="t" font-size="72">na Fé</text>
  <text x="72" y="392" class="s" font-size="30">25 histórias bíblicas em</text>
  <text x="72" y="430" class="s" font-size="30">quadrinhos + atividades</text>
  <text x="72" y="500" class="u" font-size="24">conhecimentodigital.net</text>
</svg>`);

await sharp(fundo)
  .composite([
    { input: card, left: W - cardMeta.width - 60, top: Math.round((H - cardMeta.height) / 2) },
    { input: texto, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86 })
  .toFile(out);

const m = await sharp(out).metadata();
console.log(`OK -> ${out}  ${m.width}x${m.height}  ${(m.size/1024|0)}KB`);
