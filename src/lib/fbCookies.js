// Lê os cookies que o Pixel da Meta grava no navegador (_fbp e _fbc) pra
// mandar junto no evento Purchase server-side (API de Conversões). Com eles
// a Meta consegue casar a conversão do servidor com o clique no anúncio e
// com a sessão do navegador — sem isso, a "qualidade da correspondência" do
// evento de servidor fica baixa e a atribuição de anúncio se perde.

function lerCookie(nome) {
  if (typeof document === "undefined") return undefined;
  const achado = document.cookie.match(new RegExp("(?:^|; )" + nome + "=([^;]*)"));
  return achado ? decodeURIComponent(achado[1]) : undefined;
}

export function dadosMetaNavegador() {
  const fbp = lerCookie("_fbp");
  let fbc = lerCookie("_fbc");

  // Se o cookie _fbc ainda não existe mas a URL tem fbclid (primeiro clique
  // vindo do anúncio), monta o fbc no formato que a Meta espera.
  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  const saida = {};
  if (fbp) saida.fbp = fbp;
  if (fbc) saida.fbc = fbc;
  return saida;
}
