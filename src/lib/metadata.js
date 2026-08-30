import { HERO_FE, PRODUTO_FE } from "../conteudo-aventura-fe.js";

export const SITE_URL = "https://conhecimentodigital.vercel.app";

const HOME = {
  title: "Mundo dos Blocos — 180 Atividades de Português e Matemática (1º ao 6º Ano) em PDF",
  description:
    "Material educativo imprimível com 180 atividades de Português e Matemática do 1º ao 6º ano, com a estética dos jogos de blocos. PDF com acesso vitalício, gabarito e guia dos pais. Alinhado à BNCC.",
  ogTitle: "Mundo dos Blocos — 180 Atividades de Português e Matemática",
  ogDescription:
    "180 atividades imprimíveis do 1º ao 6º ano, com a cara dos jogos de blocos que seu filho já ama. Alinhado à BNCC.",
  image: "https://4wsbsii5w3b9mlkd.public.blob.vercel-storage.com/social/og-social-meta-final-v5.jpg",
  imageAlt: "Prévia do material Mundo dos Blocos com atividades educativas imprimíveis",
  imageWidth: "1200",
  imageHeight: "630",
  imageType: "image/jpeg",
  robots: "index, follow",
};

const AVENTURA_NA_FE = {
  title: `${PRODUTO_FE.nome} — ${PRODUTO_FE.subtitulo}`,
  description: HERO_FE.subtitulo,
  ogTitle: `${PRODUTO_FE.nome} — ${PRODUTO_FE.subtitulo}`,
  ogDescription: HERO_FE.subtitulo,
  image: "/assets/aventura-na-fe/af-00-capa.png",
  imageAlt: "Capa do material imprimível Aventura na Fé",
  imageWidth: "1054",
  imageHeight: "1492",
  imageType: "image/png",
  robots: "index, follow",
};

const OBRIGADO = {
  title: "Pagamento confirmado — Mundo dos Blocos",
  description: "Confirmação de pagamento do Mundo dos Blocos.",
  ogTitle: "Pagamento confirmado — Mundo dos Blocos",
  ogDescription: "Confirmação de pagamento do Mundo dos Blocos.",
  image: HOME.image,
  imageAlt: "Mundo dos Blocos",
  imageWidth: HOME.imageWidth,
  imageHeight: HOME.imageHeight,
  imageType: HOME.imageType,
  robots: "noindex, nofollow",
};

export function metadataFor(pathname) {
  if (pathname === "/") return { ...HOME, pathname };
  if (pathname === "/aventura-na-fe") return { ...AVENTURA_NA_FE, pathname };
  if (pathname === "/obrigado") return { ...OBRIGADO, pathname };
  return { ...HOME, pathname, robots: "noindex, nofollow" };
}
