import { useState } from "react";
import {
  PRODUTO_FE,
  HERO_FE,
  SOBRE_FE,
  TEMAS_FE,
  PARA_QUEM_FE,
  BONUS_FE,
  PLANO_FE,
  FAQ_FE,
} from "../conteudo-aventura-fe";
import { Botao, Etiqueta, Marcador, Secao, Subtitulo, Titulo, precoBR } from "../componentes/Ui";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function caminhoImg(slug, tipo) {
  return `/assets/aventura-na-fe/af-${slug}-${tipo}.png`;
}

function AfHero() {
  return (
    <header className="relative overflow-hidden border-b-3 border-tinta bg-tinta">
      <img
        src="/assets/aventura-na-fe/af-00-capa.png"
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-tinta/90 via-tinta/70 to-tinta/95"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 28% 42%, rgba(0,0,0,0.5), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-24">
        <div>
          <p className="bloco-sm mb-5 inline-block rounded-sm bg-cristal px-3 py-1.5 text-xs font-extrabold tracking-wide text-papel uppercase">
            {HERO_FE.selo}
          </p>

          <h1 className="titulo-sombra font-body text-4xl leading-[1.08] font-bold text-balance sm:text-5xl lg:text-6xl">
            {HERO_FE.titulo[0]}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{HERO_FE.titulo[1]}</span>
              <span
                className="absolute inset-x-0 bottom-1 z-0 h-3.5 bg-cristal sm:h-4"
                aria-hidden="true"
              />
            </span>{" "}
            {HERO_FE.titulo[2]}
          </h1>

          <p className="bloco mt-5 max-w-xl rounded-md bg-papel px-5 py-4 text-lg leading-relaxed text-tinta text-pretty sm:text-xl">
            {HERO_FE.subtitulo}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Botao href="#planos" className="w-full bg-cristal text-papel sm:w-auto">
              {HERO_FE.cta}
            </Botao>
            <a
              href="#historias"
              className="bloco inline-flex w-full items-center justify-center rounded-md bg-papel px-7 py-4 font-display text-lg font-extrabold sm:w-auto"
            >
              {HERO_FE.ctaSecundaria}
            </a>
          </div>

          <ul className="bloco mt-8 grid gap-2.5 rounded-md bg-papel px-5 py-5 sm:grid-cols-2">
            {HERO_FE.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm font-semibold text-tinta">
                <Marcador />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="painel-rpg relative overflow-hidden p-4 sm:p-5">
            <div className="bloco absolute -top-5 -right-4 z-10 flex size-24 rotate-6 flex-col items-center justify-center rounded-full bg-cristal text-papel sm:size-28">
              <span className="font-display text-3xl leading-none font-extrabold drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] sm:text-4xl">
                {PRODUTO_FE.totalPaginas}
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                páginas
              </span>
            </div>

            <img
              src="/assets/aventura-na-fe/af-00-capa.png"
              alt="Capa do material Aventura na Fé"
              className="w-full rounded-md border-2 border-cristal/60 shadow-lg"
              width="1653"
              height="2339"
            />

            <p className="mt-4 text-center text-sm font-semibold text-papel/85">
              {PRODUTO_FE.totalTemas} histórias bíblicas &middot; {PRODUTO_FE.totalPaginas} páginas &middot;
              pronto para imprimir
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function AfSobre() {
  return (
    <Secao className="border-b-3 border-tinta bg-white">
      <Etiqueta cor="bg-cristal">
        <span className="text-papel">Como funciona</span>
      </Etiqueta>
      <Titulo className="mt-4">{SOBRE_FE.titulo}</Titulo>
      <Subtitulo>{SOBRE_FE.subtitulo}</Subtitulo>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="bloco rounded-md bg-papel p-6">
          <span className="bloco-sm inline-block rounded-sm bg-cristal px-2.5 py-1 text-xs font-extrabold text-papel uppercase">
            Passo 1
          </span>
          <h3 className="font-body mt-3 text-2xl font-bold">A história em quadrinhos</h3>
          <p className="mt-2 leading-relaxed text-tinta/75">
            6 quadrinhos, texto mínimo, pra criança que nunca ouviu aquela passagem
            entender rapidinho — com ilustração bonita em cada cena.
          </p>
        </div>
        <div className="bloco rounded-md bg-papel p-6">
          <span className="bloco-sm inline-block rounded-sm bg-ambar px-2.5 py-1 text-xs font-extrabold text-tinta uppercase">
            Passo 2
          </span>
          <h3 className="font-body mt-3 text-2xl font-bold">3 atividades diferentes</h3>
          <p className="mt-2 leading-relaxed text-tinta/75">
            Colorir, labirinto, caça-palavras, ligue os pontos, quiz bíblico e mais —
            cada tema tem uma combinação diferente pra não enjoar.
          </p>
        </div>
      </div>
    </Secao>
  );
}

function CartaoTema({ tema }) {
  return (
    <li className="bloco group relative flex shrink-0 w-56 flex-col overflow-hidden rounded-md bg-papel">
      <div className="relative h-72 overflow-hidden border-b-3 border-tinta">
        <img
          src={caminhoImg(`${tema.id.slice(3)}-${tema.slug}`, "historia")}
          alt={tema.titulo}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="text-xs font-extrabold tracking-wide text-cristal uppercase">
          Tema {tema.id.slice(3)}
        </p>
        <p className="mt-1 text-sm leading-snug font-bold text-tinta">{tema.titulo}</p>
      </div>
    </li>
  );
}

function AfHistorias() {
  const loop = [...TEMAS_FE, ...TEMAS_FE];
  return (
    <Secao id="historias" className="relative overflow-hidden border-b-3 border-tinta bg-tinta">
      <Etiqueta cor="bg-cristal">
        <span className="text-papel">25 histórias bíblicas</span>
      </Etiqueta>
      <Titulo className="titulo-claro mt-4">Do Gênesis à Grande Missão</Titulo>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-papel/80 text-pretty">
        Da Criação do Mundo até a Grande Missão, passando por Davi e Golias, Daniel na
        cova dos leões, o Bom Samaritano e muito mais.
      </p>

      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <ul className="marquee-trilho flex w-max gap-5">
          {loop.map((t, i) => (
            <CartaoTema key={`${t.id}-${i}`} tema={t} />
          ))}
        </ul>
      </div>
    </Secao>
  );
}

function AfParaQuem() {
  return (
    <Secao className="border-b-3 border-tinta bg-white">
      <Etiqueta cor="bg-ambar">Para quem é</Etiqueta>
      <Titulo className="mt-4">{PARA_QUEM_FE.titulo}</Titulo>
      <Subtitulo>{PARA_QUEM_FE.subtitulo}</Subtitulo>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {PARA_QUEM_FE.itens.map((item, i) => (
          <div key={item.titulo} className="bloco rounded-md bg-papel p-6 text-center">
            <div
              className="flutuar mx-auto flex size-16 items-center justify-center rounded-full bg-cristal text-3xl text-papel"
              style={{ "--atraso": `${(i % 3) * 0.4}s` }}
            >
              {i === 0 ? "📖" : i === 1 ? "🎨" : "🧭"}
            </div>
            <h3 className="font-body mt-4 text-xl font-bold">{item.titulo}</h3>
            <p className="mt-2 leading-relaxed text-tinta/75">{item.texto}</p>
          </div>
        ))}
      </div>
    </Secao>
  );
}

function AfBonus() {
  return (
    <Secao className="relative overflow-hidden border-b-3 border-tinta bg-tinta">
      <div className="relative">
        <Etiqueta cor="bg-energia">
          <span className="text-papel">Incluso no pacote completo</span>
        </Etiqueta>
        <Titulo className="titulo-claro mt-4">{BONUS_FE.titulo}</Titulo>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-papel/80 text-pretty">
          {BONUS_FE.subtitulo}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BONUS_FE.itens.map((b) => (
            <article
              key={b.id}
              className={`painel-rpg relative flex flex-col overflow-hidden p-4 ${
                b.destaque ? "lg:col-span-2" : ""
              }`}
            >
              {b.destaque && (
                <span className="bloco-sm absolute top-2 right-2 z-10 rounded-sm bg-energia px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-papel uppercase">
                  Favorito da criançada
                </span>
              )}
              <div className="flex h-64 items-center justify-center rounded-sm border-2 border-ambar/50 bg-papel p-2">
                <img
                  src={`/assets/${b.imagem}`}
                  alt={b.titulo}
                  className="max-h-full w-auto rounded-xs object-contain shadow-md"
                  width="700"
                  height="900"
                  loading="lazy"
                />
              </div>
              <div className="mt-4">
                <span className="text-xs font-extrabold tracking-wider text-ambar uppercase">
                  Extra {b.numero}
                </span>
                <h3 className="titulo-sombra font-body mt-1 text-3xl leading-tight font-bold">
                  {b.titulo}
                </h3>
                <p className="mt-2 leading-relaxed text-papel/85">{b.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Secao>
  );
}

async function iniciarPagamentoFe(email) {
  const resposta = await fetch("/api/criar-pagamento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plano: PLANO_FE.nome, email }),
  });
  if (!resposta.ok) throw new Error("Falha ao criar pagamento");
  const dados = await resposta.json();
  if (!dados.init_point) throw new Error("Resposta sem init_point");
  window.location.href = dados.init_point;
}

function AfPlanos() {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);
  const economia = PLANO_FE.precoDe - PLANO_FE.preco;

  async function aoClicar() {
    setErro(false);
    if (!EMAIL_REGEX.test(email.trim())) {
      setErro("email");
      return;
    }
    setCarregando(true);
    try {
      await iniciarPagamentoFe(email.trim());
    } catch {
      setErro("pagamento");
      setCarregando(false);
    }
  }

  return (
    <Secao id="planos" className="border-b-3 border-tinta bg-ceu/20">
      <div className="text-center">
        <Etiqueta cor="bg-white">Garanta o seu</Etiqueta>
        <Titulo className="mt-4">Leve as 101 páginas agora</Titulo>
      </div>

      <article className="bloco relative mx-auto mt-10 flex max-w-md flex-col rounded-md bg-white p-8 sm:p-9">
        <img
          src="/assets/aventura-na-fe/af-00-capa.png"
          alt="Capa do material Aventura na Fé"
          className="bloco-sm mx-auto h-40 w-auto rounded-sm sm:h-44"
        />

        <h3 className="mt-5 text-center text-2xl">{PLANO_FE.titulo}</h3>

        <div className="mt-6 text-center">
          <p className="text-sm font-bold text-tinta/50">
            de <s>R$ {precoBR(PLANO_FE.precoDe)}</s> por
          </p>
          <p className="mt-1 flex items-baseline justify-center gap-1.5 font-display font-extrabold">
            <span className="text-2xl">R$</span>
            <span className="text-6xl leading-none">{precoBR(PLANO_FE.preco)}</span>
          </p>
          {economia > 0 && (
            <p className="bloco-sm mt-3 inline-block rounded-sm bg-grama px-2.5 py-1 text-xs font-extrabold text-papel">
              Você economiza R$ {precoBR(economia)}
            </p>
          )}
        </div>

        <ul className="mt-7 space-y-2.5">
          {PLANO_FE.recursos.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-sm font-semibold">
              <Marcador ok />
              {r}
            </li>
          ))}
        </ul>

        <label className="mt-8 block text-left text-xs font-bold text-tinta/70">
          Seu melhor e-mail (é pra onde o material vai)
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (erro === "email") setErro(false);
            }}
            placeholder="seuemail@exemplo.com"
            className={`bloco-sm mt-1.5 block w-full rounded-md border-2 px-4 py-3 text-sm font-semibold text-tinta focus:outline-none ${
              erro === "email" ? "border-energia" : "border-tinta"
            }`}
          />
        </label>

        <button
          type="button"
          onClick={aoClicar}
          disabled={carregando}
          className="btn-bloco mt-3 block rounded-md bg-cristal px-6 py-4 text-center font-display text-lg font-extrabold text-papel disabled:cursor-wait disabled:opacity-70"
        >
          {carregando ? "Abrindo pagamento..." : "Quero o Aventura na Fé"}
        </button>

        {erro === "email" && (
          <p className="mt-2 text-center text-xs font-bold text-energia">
            Digita um e-mail válido pra gente saber pra onde mandar o material.
          </p>
        )}
        {erro === "pagamento" && (
          <p className="mt-2 text-center text-xs font-bold text-energia">
            Não foi possível abrir o pagamento. Tente novamente.
          </p>
        )}

        <p className="mt-3 text-center text-xs font-semibold text-tinta/60">
          Pagamento único &middot; Pix ou cartão &middot; acesso imediato
        </p>
      </article>
    </Secao>
  );
}

function AfFaq() {
  return (
    <Secao className="border-b-3 border-tinta bg-white">
      <div className="mx-auto max-w-3xl">
        <Etiqueta cor="bg-pedra">Dúvidas</Etiqueta>
        <Titulo className="mt-4">{FAQ_FE.titulo}</Titulo>

        <div className="mt-10 space-y-4">
          {FAQ_FE.itens.map((item) => (
            <details
              key={item.p}
              name="faq-fe"
              className="bloco group rounded-md bg-papel open:bg-white"
            >
              <summary className="font-body flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-2xl leading-tight font-bold [&::-webkit-details-marker]:hidden">
                {item.p}
                <span
                  className="bloco-sm flex size-9 shrink-0 items-center justify-center rounded-sm bg-cristal text-xl leading-none text-papel transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="border-t-2 border-dashed border-tinta/20 px-5 py-4 leading-relaxed text-tinta/80">
                {item.r}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Secao>
  );
}

export default function AventuraNaFe() {
  return (
    <>
      <AfHero />
      <main>
        <AfSobre />
        <AfHistorias />
        <AfParaQuem />
        <AfBonus />
        <AfPlanos />
        <AfFaq />
      </main>
    </>
  );
}
