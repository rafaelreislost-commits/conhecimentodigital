import { PRODUTO, RODAPE } from "../conteudo";

export default function Rodape({ produto = PRODUTO, disclaimer = RODAPE.disclaimer }) {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-tinta px-5 py-14 text-papel/70 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex max-w-sm gap-4">
            <img
              src="/assets/selo-conhecimento-digital.webp"
              alt=""
              className="size-14 shrink-0 rounded-full border-2 border-ambar/50"
              width="200"
              height="200"
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-xl font-extrabold text-papel">
                {produto.nome}
              </p>
              <p className="mt-1 text-sm">{produto.subtitulo}</p>
              <p className="mt-3 text-sm">
                {RODAPE.razaoSocial} &middot;{" "}
                <a
                  href={`mailto:${RODAPE.emailSuporte}`}
                  className="font-semibold text-papel underline underline-offset-2"
                >
                  {RODAPE.emailSuporte}
                </a>
              </p>
            </div>
          </div>

          <nav className="text-sm">
            <p className="mb-3 font-bold text-papel">Links</p>
            <ul className="space-y-2">
              <li>
                <a href="#planos" className="hover:text-papel">
                  Comprar
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-papel">
                  Perguntas frequentes
                </a>
              </li>
              <li>
                <a href="/termos.html" className="hover:text-papel">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="/privacidade.html" className="hover:text-papel">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <hr className="my-8 border-papel/15" />

        <p className="text-xs leading-relaxed">{disclaimer}</p>
        <p className="mt-3 text-xs">
          &copy; {ano} {RODAPE.razaoSocial}
          {RODAPE.cnpj && ` — CNPJ ${RODAPE.cnpj}`}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
