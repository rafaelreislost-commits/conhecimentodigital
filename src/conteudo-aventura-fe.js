/**
 * Conteúdo da página "Aventura na Fé" — produto irmão do Mundo dos Blocos,
 * dentro da mesma marca Conhecimento Digital.
 *
 * Itens marcados com ⚠️ REVISAR precisam da sua decisão antes de publicar.
 */

export const PRODUTO_FE = {
  nome: "Aventura na Fé",
  subtitulo: "25 histórias bíblicas em quadrinhos + atividades",
  totalPaginas: 101,
  totalTemas: 25,
};

export const HERO_FE = {
  selo: "Material digital para imprimir em casa",
  titulo: ["Ensine a Bíblia pra", "seu filho de um jeito", "que ele vai amar"],
  subtitulo:
    "25 histórias bíblicas contadas em quadrinhos, cada uma com 3 atividades diferentes — colorir, labirinto, caça-palavras, quiz e muito mais. 101 páginas prontas pra imprimir.",
  cta: "Quero o material agora",
  ctaSecundaria: "Ver as histórias",
  bullets: [
    "PDF imprimível, acesso vitalício",
    "25 histórias bíblicas em quadrinhos",
    "3 atividades por história (75 no total)",
    "Entrega automática por e-mail",
  ],
};

export const SOBRE_FE = {
  titulo: "Muito mais do que colorir",
  subtitulo:
    "Cada tema tem uma página de história em 6 quadrinhos — pra criança que nunca ouviu aquela passagem entender rapidinho — seguida de 3 páginas de atividades diferentes pra fixar o aprendizado brincando.",
};

export const TEMAS_FE = [
  { id: "AF-01", slug: "criacao", titulo: "A Criação do Mundo" },
  { id: "AF-02", slug: "arca", titulo: "A Arca de Noé" },
  { id: "AF-03", slug: "jose", titulo: "José e o Sonho Realizado" },
  { id: "AF-04", slug: "davi", titulo: "Davi e Golias" },
  { id: "AF-05", slug: "daniel", titulo: "Daniel na Cova dos Leões" },
  { id: "AF-06", slug: "nascimento", titulo: "O Nascimento de Jesus" },
  { id: "AF-07", slug: "tempestade", titulo: "Jesus Acalma a Tempestade" },
  { id: "AF-08", slug: "paes-e-peixes", titulo: "A Multiplicação dos Pães e Peixes" },
  { id: "AF-09", slug: "bom-samaritano", titulo: "O Bom Samaritano" },
  { id: "AF-10", slug: "filho-prodigo", titulo: "O Filho Pródigo" },
  { id: "AF-11", slug: "criancinhas", titulo: "Jesus Abençoa as Criancinhas" },
  { id: "AF-12", slug: "ressurreicao", titulo: "A Ressurreição de Jesus" },
  { id: "AF-13", slug: "moises-sarca", titulo: "Moisés e a Sarça Ardente" },
  { id: "AF-14", slug: "mar-vermelho", titulo: "A Travessia do Mar Vermelho" },
  { id: "AF-15", slug: "dez-mandamentos", titulo: "Os Dez Mandamentos" },
  { id: "AF-16", slug: "jerico", titulo: "Josué e as Muralhas de Jericó" },
  { id: "AF-17", slug: "giedeao", titulo: "Gideão e os 300 Guerreiros" },
  { id: "AF-18", slug: "sansao", titulo: "Sansão, o Homem Forte" },
  { id: "AF-19", slug: "rute", titulo: "Rute, a Fiel" },
  { id: "AF-20", slug: "ester", titulo: "Ester, a Rainha Corajosa" },
  { id: "AF-21", slug: "jonas", titulo: "Jonas e o Grande Peixe" },
  { id: "AF-22", slug: "fornalha", titulo: "Os Três Amigos na Fornalha" },
  { id: "AF-23", slug: "zaqueu", titulo: "Zaqueu, o Homem Baixinho" },
  { id: "AF-24", slug: "ultima-ceia", titulo: "A Última Ceia" },
  { id: "AF-25", slug: "grande-missao", titulo: "A Grande Missão" },
];

export const PARA_QUEM_FE = {
  titulo: "Feito para crianças de 3 a 10 anos",
  subtitulo:
    "Linguagem simples, ilustrações acolhedoras e atividades que se adaptam à idade — do rabisco livre da pré-escola ao quiz bíblico dos mais velhos.",
  itens: [
    {
      icone: "livro",
      titulo: "Nunca ouviu falar de Davi e Golias?",
      texto:
        "A história vem primeiro, em quadrinhos com texto mínimo — ela entende antes de fazer a atividade.",
    },
    {
      icone: "bau",
      titulo: "Já sabe a história de cor?",
      texto:
        "As atividades variam entre colorir, labirinto, caça-palavras e quiz — sempre um jeito novo de revisitar o mesmo tema.",
    },
    {
      icone: "bussola",
      titulo: "Tempo de tela em excesso?",
      texto:
        "101 páginas prontas pra imprimir — semanas de atividade sem precisar de internet nem tela.",
    },
  ],
};

export const PLANO_FE = {
  nome: "aventura-fe",
  titulo: "Aventura na Fé — Pacote completo",
  preco: 34.9,
  precoDe: 49.9,
  recursos: [
    "25 histórias bíblicas em quadrinhos",
    "75 páginas de atividades (3 por tema)",
    "101 páginas no total",
    "Bônus: Bonecos de Papel, Mapa da Jornada, Certificado, Plano de Leitura, Cartões de Versículos e Guia para os Pais",
    "PDF pra imprimir, acesso vitalício",
  ],
};

export const BONUS_FE = {
  titulo: "E ainda vem junto",
  subtitulo:
    "Cinco materiais extras que dão vida ao aprendizado fora do papel — de recortar e brincar a acompanhar o progresso na parede.",
  itens: [
    {
      id: "bonecos",
      numero: 1,
      titulo: "Bonecos de Papel",
      texto:
        "Davi, Moisés, Jesus e os mascotes Menino e Menina Aventureiros — em diferentes tons de pele — prontos pra recortar e trocar de roupa.",
      imagem: "aventura-na-fe/bonus/bonus-bonecos-1.png",
      destaque: true,
    },
    {
      id: "mapa",
      numero: 2,
      titulo: "Mapa da Jornada de Fé",
      texto:
        "Pôster para colar na parede. A criança marca cada história concluída e acompanha a jornada avançar.",
      imagem: "aventura-na-fe/bonus/bonus-mapa-jornada.png",
    },
    {
      id: "certificado",
      numero: 3,
      titulo: "Certificado de Pequeno Discípulo",
      texto:
        "Pra imprimir e entregar quando ela terminar as 25 histórias — um jeitinho de celebrar o esforço.",
      imagem: "aventura-na-fe/bonus/bonus-certificado.png",
    },
    {
      id: "plano",
      numero: 4,
      titulo: "Plano de Leitura Semanal",
      texto: "Roteiro pronto pra saber qual história e atividade aplicar em cada semana.",
      imagem: "aventura-na-fe/bonus/bonus-plano-leitura.png",
    },
    {
      id: "cartoes",
      numero: 5,
      titulo: "Cartões de Versículos",
      texto: "25 cartões coloridos, um versículo-chave de cada história pra guardar e recordar.",
      imagem: "aventura-na-fe/bonus/bonus-cartoes-versiculos-1.png",
    },
    {
      id: "guia",
      numero: 6,
      titulo: "Guia Rápido para os Pais",
      texto: "Como conduzir a conversa depois de cada história, sem precisar ser teólogo.",
      imagem: "aventura-na-fe/bonus/bonus-guia-pais-1.png",
    },
  ],
};

export const FAQ_FE = {
  titulo: "Perguntas frequentes",
  itens: [
    {
      p: "Para qual idade é indicado?",
      r: "Para crianças de 3 a 10 anos. As atividades variam em dificuldade — dá pra usar com mais de um filho ao mesmo tempo, cada um na sua página.",
    },
    {
      p: "Preciso imprimir colorido?",
      r: "As páginas de história vêm coloridas (ficam lindas mesmo em preto e branco também). As atividades de colorir já são em contorno, prontas pra criança pintar.",
    },
    {
      p: "Como recebo o material?",
      r: "Assim que o pagamento é aprovado, você recebe um e-mail com o link de download do PDF completo — funciona com Pix ou cartão, e o link não expira.",
    },
  ],
};
