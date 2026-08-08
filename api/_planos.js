// Configuração compartilhada dos planos — usada pela criação do pagamento
// e pelo webhook que envia o e-mail após a confirmação.
// Preço e lista de arquivos SEMPRE definidos aqui (servidor), nunca no cliente.
import urls from "./_materiais-urls.json" with { type: "json" };

function arquivo(chave, nome) {
  // Sem lançar erro aqui: criar-pagamento.js precisa continuar funcionando
  // mesmo antes de rodar scripts/upload-materiais.mjs. O webhook-mp.js é
  // quem valida (ver validarArquivos) antes de tentar enviar o e-mail.
  return { nome, url: urls[chave] || null };
}

// Usado pelo webhook antes de enviar o e-mail: recusa mandar um e-mail com
// link quebrado se o upload dos PDFs ainda não rodou.
export function validarArquivos(plano) {
  return plano.arquivos.every((a) => Boolean(a.url));
}

export const PLANOS = {
  basico: {
    titulo: "Mundo dos Blocos — Só o material",
    preco: 19.9,
    arquivos: [
      arquivo("portugues", "Português no Mundo dos Blocos.pdf"),
      arquivo("matematica", "Matemática no Mundo dos Blocos.pdf"),
    ],
  },
  completo: {
    titulo: "Mundo dos Blocos — Pacote completo",
    preco: 34.9,
    arquivos: [
      arquivo("portugues", "Português no Mundo dos Blocos.pdf"),
      arquivo("matematica", "Matemática no Mundo dos Blocos.pdf"),
      arquivo("mapa", "Mapa de Progresso do Aventureiro.pdf"),
      arquivo("cards", "Cards de Recompensa.pdf"),
      arquivo("guia", "Guia Rápido para os Pais.pdf"),
      arquivo("bonecos", "Bonecos de Papel.pdf"),
    ],
  },
};
