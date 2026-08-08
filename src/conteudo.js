/**
 * TODO O TEXTO DA LANDING FICA AQUI.
 *
 * Editar este arquivo muda a página inteira — não é preciso mexer nos componentes.
 * Itens marcados com  ⚠️ REVISAR  precisam da sua decisão antes de publicar.
 */

export const PRODUTO = {
  nome: "Mundo dos Blocos",
  subtitulo: "Português + Matemática",
  // ⚠️ REVISAR: usamos "jogos de blocos" em vez de "Minecraft"/"Roblox" no texto
  // do produto. Os nomes são marcas registradas da Mojang/Microsoft e da Roblox
  // Corp — usá-los no nome do produto ou nos anúncios é risco real de takedown
  // (e de derrubarem a conta de anúncios junto). O tema visual continua o mesmo.
  totalAtividades: 50,
  totalPaginas: 118,
  anoInicial: 1,
  anoFinal: 6,
};

export const OFERTA = {
  // ⚠️ REVISAR: coloque aqui a data real em que a promoção termina.
  // O contador só aparece se a data for futura — quando passar, a página volta
  // ao preço cheio sozinha. Contador falso que reinicia a cada visita é
  // prática enganosa (CDC art. 37) e o Meta derruba anúncio por isso.
  fimDaPromocao: "2026-08-16T23:59:59-03:00",
  ativa: true,
};

export const HERO = {
  selo: "Material digital para imprimir em casa",
  titulo: ["Seu filho aprendendo", "de verdade", "no mundo dos blocos"],
  subtitulo:
    "50 atividades de Português e Matemática do 1º ao 6º ano, com a cara dos jogos de blocos que ele já ama. Você imprime, ele resolve — longe da tela.",
  cta: "Quero o material agora",
  ctaSecundaria: "Ver o que vem dentro",
  bullets: [
    "PDF imprimível, acesso vitalício",
    "Alinhado à BNCC",
    "Gabarito e guia dos pais inclusos",
    "Entrega automática por e-mail",
  ],
};

export const PARA_QUEM = {
  titulo: "Feito para crianças como a sua",
  subtitulo:
    "Se você reconhece seu filho em pelo menos dois destes, o material foi desenhado exatamente para ele.",
  itens: [
    {
      icone: "picareta",
      titulo: "Ama jogos de blocos",
      texto:
        "O interesse já existe. A gente só coloca o conteúdo escolar dentro do universo que ele escolheu sozinho.",
    },
    {
      icone: "pocao",
      titulo: "Trava em Português",
      texto:
        "Sílabas, classes de palavras e ortografia treinados sem a pressão da prova — em atividade curta, de 10 a 15 minutos.",
    },
    {
      icone: "cristal",
      titulo: "Não gosta de Matemática",
      texto:
        "Os problemas viram missões: contar blocos, dividir minério, medir a construção. A conta é a mesma, o convite é outro.",
    },
    {
      icone: "bau",
      titulo: "Passa horas na tela",
      texto:
        "Material 100% impresso. Sem app, sem login, sem notificação. É papel, lápis e a mesa da cozinha.",
    },
    {
      icone: "bussola",
      titulo: "Aprende vendo",
      texto:
        "Mapas, baús, tabelas e trilhas deixam o abstrato concreto. Quem aprende visualmente vai bem aqui.",
    },
    {
      icone: "livro",
      titulo: "Precisa de reforço",
      texto:
        "Serve como apoio ao que a escola já está passando, organizado por ano escolar para você saber onde começar.",
    },
  ],
};

export const MODULOS = {
  titulo: "O que vem dentro",
  subtitulo:
    "Organizado por ano escolar. Cada atividade indica o ano-alvo e a habilidade da BNCC que trabalha — você sabe exatamente o que seu filho está treinando.",
  // As imagens vêm de /assets/modulo-N.svg
  itens: [
    {
      id: 1,
      selo: "1º ano",
      titulo: "Primeiras palavras",
      texto:
        "Vogais, consoantes, sílabas simples e reconhecimento de palavras. Contagem até 20 e as primeiras somas com blocos.",
      atividades: 6,
    },
    {
      id: 2,
      selo: "2º ano",
      titulo: "Sílabas e somas",
      texto:
        "Separação de sílabas, ordem alfabética e vocabulário. Adição e subtração até 100 em problemas ilustrados.",
      atividades: 8,
    },
    {
      id: 3,
      selo: "3º ano",
      titulo: "Classes de palavras",
      texto:
        "Substantivo, adjetivo e verbo na bancada de crafting. Multiplicação, dobro e metade, tabuada visual.",
      atividades: 8,
    },
    {
      id: 4,
      selo: "4º ano",
      titulo: "Frases e operações",
      texto:
        "Formação de frases, pontuação e concordância. Divisão, problemas de duas etapas e medidas.",
      atividades: 10,
    },
    {
      id: 5,
      selo: "5º ano",
      titulo: "Ortografia e frações",
      texto:
        "Letras que confundem, acentuação e tempos verbais. Frações, decimais e porcentagem simples.",
      atividades: 10,
    },
    {
      id: 6,
      selo: "6º ano",
      titulo: "Leitura e proporção",
      texto:
        "Interpretação de texto, pronomes e coesão. Proporção, área, perímetro e raciocínio lógico.",
      atividades: 8,
    },
  ],
};

export const BONUS = {
  titulo: "E ainda vem junto",
  subtitulo:
    "Quatro materiais extras que transformam a atividade solta em rotina de verdade.",
  itens: [
    {
      id: "mapa",
      numero: 1,
      titulo: "Mapa de Progresso",
      texto:
        "Pôster para colar na parede. A criança marca cada atividade concluída e vê a trilha avançar — a gamificação acontece no papel, não na tela.",
      imagem: "mapa.webp",
    },
    {
      id: "cartoes",
      numero: 2,
      titulo: "Cartões de Recompensa",
      texto:
        "30 cartões colecionáveis para imprimir e recortar. Reforço positivo que cria hábito sem virar suborno.",
      imagem: "cartoes.webp",
    },
    {
      id: "guia",
      numero: 3,
      titulo: "Guia Rápido dos Pais",
      texto:
        "Como acompanhar sem brigar: o que dizer quando ele erra, quanto tempo por sessão, como saber se está no ano certo.",
      imagem: "guia.webp",
    },
    {
      id: "plano",
      numero: 4,
      titulo: "Plano de Estudos Semanal",
      texto:
        "Roteiro pronto de 8 semanas. Você olha o dia e sabe qual atividade aplicar — sem improviso e sem culpa.",
      imagem: "plano.webp",
    },
  ],
};

/**
 * ⚠️ REVISAR — DEPOIMENTOS
 *
 * Deixei a seção pronta mas VAZIA de propósito. Inventar depoimento de cliente,
 * nota média e "+2.000 avaliações" antes da primeira venda é publicidade
 * enganosa (CDC art. 37) e é o tipo de coisa que derruba conta no Meta Ads.
 *
 * COMO PREENCHER, na ordem do que dá menos trabalho:
 *  1. Dê o material de graça para 8–10 famílias conhecidas em troca de
 *     depoimento honesto + foto da criança usando (com autorização por escrito).
 *  2. Depois das primeiras vendas, mande e-mail no 7º dia pedindo feedback.
 *  3. Só então ligue `mostrarSecao: true`.
 *
 * Enquanto estiver vazio, a página mostra a seção de GARANTIA no lugar — que
 * converte bem e é 100% verdadeira.
 */
export const DEPOIMENTOS = {
  mostrarSecao: false,
  titulo: "O que dizem as famílias",
  itens: [
    // {
    //   nome: "Nome real da pessoa",
    //   contexto: "mãe do Pedro, 8 anos",
    //   texto: "Depoimento real, com autorização de uso.",
    //   nota: 5,
    // },
  ],
};

export const PLANOS = {
  titulo: "Escolha como começar",
  subtitulo: "Pagamento único. Sem assinatura, sem renovação, sem pegadinha.",
  itens: [
    {
      id: "basico",
      nome: "Só o material",
      descricao: "As 50 atividades completas, sem os extras.",
      precoDe: 39.9,
      preco: 19.9,
      parcelas: null,
      destaque: false,
      recursos: [
        { texto: "50 atividades (25 Português + 25 Matemática)", tem: true },
        { texto: "Do 1º ao 6º ano", tem: true },
        { texto: "Gabarito completo", tem: true },
        { texto: "PDF vitalício para reimprimir", tem: true },
        { texto: "Mapa de Progresso", tem: false },
        { texto: "Cartões de Recompensa", tem: false },
        { texto: "Guia Rápido dos Pais", tem: false },
        { texto: "Plano de Estudos Semanal", tem: false },
      ],
    },
    {
      id: "completo",
      nome: "Pacote completo",
      descricao: "Tudo do material + os 4 bônus. É o que quase todo mundo leva.",
      precoDe: 97.9,
      preco: 34.9,
      parcelas: "ou 3x de R$ 12,42",
      destaque: true,
      selo: "Melhor custo-benefício",
      recursos: [
        { texto: "50 atividades (25 Português + 25 Matemática)", tem: true },
        { texto: "Do 1º ao 6º ano", tem: true },
        { texto: "Gabarito completo", tem: true },
        { texto: "PDF vitalício para reimprimir", tem: true },
        { texto: "Mapa de Progresso", tem: true },
        { texto: "30 Cartões de Recompensa", tem: true },
        { texto: "Guia Rápido dos Pais", tem: true },
        { texto: "Plano de Estudos Semanal", tem: true },
      ],
    },
  ],
};

export const GARANTIA = {
  titulo: "Compra 100% segura",
  // ⚠️ REVISAR: mesmo sem anunciar prazo de reembolso aqui, o direito de
  // arrependimento de 7 dias (CDC art. 49) continua valendo por lei pra
  // qualquer compra online — não anunciar não remove a obrigação legal.
  texto: [
    "Pagamento processado pelo Mercado Pago, com Pix, cartão ou boleto.",
    "Acesso enviado por e-mail assim que o pagamento é aprovado, com link de download vitalício.",
    "Dúvidas ou problemas com o pedido? É só responder o e-mail da compra.",
  ],
};

export const FAQ = {
  titulo: "Perguntas frequentes",
  itens: [
    {
      p: "Como recebo o material?",
      r: "Assim que o pagamento é confirmado, chega um e-mail com o link de download. O acesso é vitalício: pode baixar de novo sempre que precisar, de qualquer aparelho.",
    },
    {
      p: "É produto físico? Vocês enviam pelo correio?",
      r: "Não. É digital — um PDF que você baixa e imprime em casa ou numa gráfica rápida. Isso é o que permite o preço ser esse, e o que deixa você reimprimir quantas vezes quiser.",
    },
    {
      p: "Preciso imprimir tudo de uma vez?",
      r: "Não. A maioria das famílias imprime o módulo do ano da criança e vai avançando. Cada atividade cabe em uma folha A4.",
    },
    {
      p: "Meu filho tem 7 anos. Qual módulo eu uso?",
      r: "Comece pelo módulo do ano escolar dele. O Guia dos Pais tem um teste rápido de 5 minutos para confirmar se está no nível certo, ou se vale voltar ou avançar um módulo.",
    },
    {
      p: "Preciso saber ensinar para aplicar?",
      r: "Não. Toda atividade tem enunciado escrito para a criança e gabarito para você. O Guia dos Pais explica o que fazer quando ela erra e como corrigir sem desanimar.",
    },
    {
      p: "Funciona em impressora preto e branco?",
      r: "Funciona. As artes foram desenhadas com contraste alto justamente para isso — em cores ficam mais bonitas, em P&B continuam totalmente legíveis.",
    },
    {
      p: "Isso é material oficial de algum jogo?",
      r: "Não, e a gente faz questão de deixar claro: é um material educativo independente, com arte original inspirada na estética de mundos feitos de blocos. Não temos vínculo com a Mojang, a Microsoft ou a Roblox Corporation.",
    },
    {
      p: "E se eu não gostar?",
      r: "É só responder o e-mail da compra e explicar o que houve — a gente resolve. E como em toda compra online, você conta com o direito de arrependimento previsto no Código de Defesa do Consumidor.",
    },
  ],
};

export const RODAPE = {
  // ⚠️ REVISAR: preencher com seus dados reais antes de publicar.
  // E-mail de suporte é obrigatório; CNPJ é obrigatório se você emitir nota.
  emailSuporte: "SEU-EMAIL@dominio.com.br",
  razaoSocial: "SEU NOME OU RAZÃO SOCIAL",
  cnpj: "",
  disclaimer:
    "Material educativo independente, com arte original. Não possui vínculo, patrocínio ou aprovação da Mojang Studios, Microsoft Corporation ou Roblox Corporation. As marcas citadas pertencem aos seus respectivos titulares.",
};

// ⚠️ REVISAR: cole seu Pixel ID. Deixe vazio para não carregar nada.
export const PIXEL_ID = "";
