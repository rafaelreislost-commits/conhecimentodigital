import { HERO, PRODUTO } from "../conteudo";
import { Botao, Marcador } from "./Ui";

export default function Hero() {
  return (
    <header className="relative overflow-hidden border-b-3 border-tinta bg-tinta">
      {/* Cena ilustrada rica em tela cheia, como fundo dominante do Hero */}
      <img
        src="/assets/cenario-mundo.webp"
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-tinta/85 via-tinta/50 to-tinta/95"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url(/assets/pattern-blocks.svg)" }}
        aria-hidden="true"
      />
      {/* Elenco reunido, em pé no chão da cena, ancorando a base do Hero */}
      <img
        src="/assets/grupo-personagens.webp"
        alt="Explorador, Construtora, Leitora, Leitor e Mascote reunidos no Mundo dos Blocos"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[46%] w-full object-cover object-top [mask-image:linear-gradient(to_bottom,black_70%,transparent)] lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-24">
        <div>
          <img
            src="/assets/logo-mundo-dos-blocos.webp"
            alt={PRODUTO.nome}
            className="mb-7 h-32 w-auto max-w-full drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)] sm:h-40 lg:h-44"
            width="1528"
            height="582"
          />

          <p className="bloco-sm mb-5 inline-block rounded-sm bg-ambar px-3 py-1.5 text-xs font-extrabold tracking-wide text-tinta uppercase">
            {HERO.selo}
          </p>

          <h1 className="titulo-3d text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
            {HERO.titulo[0]}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{HERO.titulo[1]}</span>
              <span
                className="absolute inset-x-0 bottom-1 z-0 h-3.5 bg-ambar sm:h-4"
                aria-hidden="true"
              />
            </span>{" "}
            {HERO.titulo[2]}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-papel/90 text-pretty sm:text-xl">
            {HERO.subtitulo}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Botao href="#planos" className="w-full sm:w-auto">
              {HERO.cta}
            </Botao>
            <a
              href="#previas"
              className="bloco inline-flex w-full items-center justify-center rounded-md bg-papel px-7 py-4 font-display text-lg font-extrabold sm:w-auto"
            >
              {HERO.ctaSecundaria}
            </a>
          </div>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {HERO.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm font-semibold text-papel"
              >
                <Marcador />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="painel-rpg relative overflow-hidden p-4 sm:p-5">
            {/* Selo do total de atividades, sobre o emblema do mundo */}
            <div className="bloco absolute -top-5 -right-4 z-10 flex size-24 rotate-6 flex-col items-center justify-center rounded-full text-papel sm:size-28">
              <img
                src="/assets/emblema-mundo.webp"
                alt=""
                className="absolute inset-0 -z-10 size-full rounded-full object-cover"
                aria-hidden="true"
              />
              <span className="font-display text-3xl leading-none font-extrabold drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] sm:text-4xl">
                {PRODUTO.totalAtividades}
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                atividades
              </span>
            </div>

            <img
              src="/assets/completo.webp"
              alt="Capa do pacote completo Mundo dos Blocos"
              className="w-full rounded-md border-2 border-ambar/70 shadow-lg"
              width="1200"
              height="1600"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <img
                src="/assets/portugues.webp"
                alt="Capa do livro Português no Mundo dos Blocos"
                className="w-full rounded-sm border-2 border-ambar/50 shadow-md"
                width="600"
                height="800"
                loading="lazy"
              />
              <img
                src="/assets/matematica.webp"
                alt="Capa do livro Matemática no Mundo dos Blocos"
                className="w-full rounded-sm border-2 border-ambar/50 shadow-md"
                width="600"
                height="800"
                loading="lazy"
              />
            </div>

            <p className="mt-4 text-center text-sm font-semibold text-papel/85">
              {PRODUTO.anoInicial}º ao {PRODUTO.anoFinal}º ano &middot;{" "}
              {PRODUTO.totalPaginas} páginas &middot; pronto para imprimir
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
