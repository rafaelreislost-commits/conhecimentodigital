import { TIKTOK_PIXEL_ID } from "../conteudo";

/**
 * TikTok Pixel — só carrega se TIKTOK_PIXEL_ID estiver preenchido em
 * conteudo.js. Sem ID, todas as funções viram no-op e nada é enviado ao TikTok.
 */

let carregado = false;

export function iniciarTiktokPixel() {
  if (carregado || !TIKTOK_PIXEL_ID || typeof window === "undefined") return;
  carregado = true;

  /* eslint-disable */
  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    (ttq.methods = [
      "page","track","identify","instances","debug","on","off","once",
      "ready","alias","group","enableCookie","disableCookie",
    ]),
      (ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      });
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    (ttq.instance = function (t) {
      for (var e = ttq._i[t] || [], n = 0; n < e.methods.length; n++) ttq.setAndDefer(e, e.methods[n]);
      return e;
    }),
      (ttq.load = function (e, n) {
        var i = "https://analytics.tiktok.com/i18n/pixel/events.js",
          o = n && n.partner;
        (ttq._i = ttq._i || {}),
          (ttq._i[e] = []),
          (ttq._i[e]._u = i),
          (ttq._t = ttq._t || {}),
          (ttq._t[e] = +new Date()),
          (ttq._o = ttq._o || {}),
          (ttq._o[e] = n || {});
        n = document.createElement("script");
        (n.type = "text/javascript"), (n.async = !0), (n.src = i + "?sdkid=" + e + "&lib=" + t);
        e = document.getElementsByTagName("script")[0];
        e.parentNode.insertBefore(n, e);
      });

    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  })(window, document, "ttq");
  /* eslint-enable */
}

export function rastrearTiktok(evento, dados) {
  if (!TIKTOK_PIXEL_ID || typeof window === "undefined" || !window.ttq) return;
  window.ttq.track(evento, dados);
}

/** Clique em qualquer botão de compra → InitiateCheckout. */
export function rastrearTiktokCheckout(plano) {
  rastrearTiktok("InitiateCheckout", {
    content_name: plano.nome,
    content_id: plano.id,
    value: plano.preco,
    currency: "BRL",
  });
}

/** Pagamento confirmado → CompletePayment (evento de compra do TikTok). */
export function rastrearTiktokCompra(plano) {
  rastrearTiktok("CompletePayment", {
    content_name: plano?.nome,
    content_id: plano?.id,
    value: plano?.preco,
    currency: "BRL",
  });
}
