import { PIXEL_ID } from "../conteudo";

/**
 * Meta Pixel — só carrega se PIXEL_ID estiver preenchido em conteudo.js.
 * Sem ID, todas as funções viram no-op e nada é enviado para o Meta.
 */

let carregado = false;

export function iniciarPixel() {
  if (carregado || !PIXEL_ID || typeof window === "undefined") return;
  carregado = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function rastrear(evento, dados) {
  if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", evento, dados);
}

/** Clique em qualquer botão de compra → InitiateCheckout. */
export function rastrearCheckout(plano) {
  rastrear("InitiateCheckout", {
    content_name: plano.nome,
    content_ids: [plano.id],
    value: plano.preco,
    currency: "BRL",
  });
}
