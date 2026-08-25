import { useState } from "react";
import { PLANOS } from "../conteudo";
import { rastrearCheckout } from "../lib/pixel";
import { rastrearTiktokCheckout } from "../lib/tiktokPixel";
import { Etiqueta, Marcador, Secao, Subtitulo, Titulo, precoBR } from "./Ui";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function iniciarPagamento(p, email) {
  const resposta = await fetch("/api/criar-pagamento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plano: p.id, email }),
  });
  if (!resposta.ok) {
    throw new Error("Falha ao criar pagamento");
  }
  const dados = await resposta.json();
  if (!dados.init_point) {
    throw new Error("Resposta sem init_point");
  }
  window.location.href = dados.init_point;
}

function Plano({ p }) {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);
  const economia = p.precoDe - p.preco;
  const capas = p.destaque
    ? ["/assets/completo.webp"]
    : ["/assets/portugues.webp", "/assets/matematica.webp"];

  async function aoClicar() {
    setErro(false);
    if (!EMAIL_REGEX.test(email.trim())) {
      setErro("email");
      return;
    }
    setCarregando(true);
    rastrearCheckout(p);
    rastrearTiktokCheckout(p);
    try {
      await iniciarPagamento(p, email.trim());
    } catch {
      setErro("pagamento");
      setCarregando(false);
    }
  }

  return (
    <article
      className={`bloco relative flex h-full flex-col rounded-md p-8 sm:p-9 ${
        p.destaque ? "bg-white" : "bg-papel"
      }`}
    >
      {p.destaque && p.selo && (
        <span className="bloco-sm absolute -top-4 left-1/2 -translate-x-1/2 rounded-sm bg-energia px-4 py-1.5 text-xs font-extrabold whitespace-nowrap text-papel uppercase">
          {p.selo}
        </span>
      )}

      <div className="mb-5 flex justify-center gap-3">
        {capas.map((c) => (
          <img
            key={c}
            src={c}
            alt=""
            className="bloco-sm h-32 w-auto rounded-sm sm:h-36"
            width="600"
            height="800"
            loading="lazy"
          />
        ))}
      </div>

      <h3 className="text-2xl">{p.nome}</h3>
      <p className="mt-2 text-tinta/70">{p.descricao}</p>

      <div className="mt-6">
        <p className="text-sm font-bold text-tinta/50">
          de <s>R$ {precoBR(p.precoDe)}</s> por
        </p>
        <p className="mt-1 flex items-baseline gap-1.5 font-display font-extrabold">
          <span className="text-2xl">R$</span>
          <span className="text-6xl leading-none">{precoBR(p.preco)}</span>
        </p>
        {p.parcelas && (
          <p className="mt-2 text-sm font-semibold text-tinta/70">{p.parcelas}</p>
        )}
        {economia > 0 && (
          <p className="bloco-sm mt-3 inline-block rounded-sm bg-grama px-2.5 py-1 text-xs font-extrabold text-papel">
            Você economiza R$ {precoBR(economia)}
          </p>
        )}
      </div>

      <ul className="mt-7 grow space-y-2.5">
        {p.recursos.map((r) => (
          <li
            key={r.texto}
            className={`flex items-start gap-2.5 text-sm ${
              r.tem ? "font-semibold" : "text-tinta/40 line-through"
            }`}
          >
            <Marcador ok={r.tem} />
            {r.texto}
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
        className={`btn-bloco mt-3 block rounded-md px-6 py-4 text-center font-display text-lg font-extrabold disabled:cursor-wait disabled:opacity-70 ${
          p.destaque ? "bg-ambar" : "bg-white"
        }`}
      >
        {carregando
          ? "Abrindo pagamento..."
          : p.destaque
            ? "Quero o pacote completo"
            : "Quero só o material"}
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
      <p className="mt-2 text-center text-xs font-semibold text-grama">
        ✅ Pagou no Pix e a tela não voltou sozinha? Sem problema — assim
        que aprovar, o material chega no seu e-mail.
      </p>
    </article>
  );
}

export default function Planos() {
  return (
    <Secao id="planos" className="border-b-3 border-tinta bg-ceu/20">
      <div className="text-center">
        <Etiqueta cor="bg-white">Escolha seu pacote</Etiqueta>
        <Titulo className="mt-4">{PLANOS.titulo}</Titulo>
        <div className="mx-auto flex justify-center">
          <Subtitulo>{PLANOS.subtitulo}</Subtitulo>
        </div>
      </div>

      <div className="bloco mx-auto mt-10 flex max-w-3xl flex-col items-start gap-3 rounded-md bg-white p-6 sm:flex-row sm:items-center sm:gap-5 sm:p-7">
        <div className="bloco-sm flex size-12 shrink-0 items-center justify-center rounded-full bg-grama text-papel">
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
            <path
              d="M3 7 12 13 21 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        <p className="text-sm leading-relaxed font-semibold text-tinta/80 sm:text-base">
          Assim que o pagamento é aprovado, você recebe um e-mail com todos os
          links de download — funciona com Pix, cartão ou boleto. Guarda esse
          e-mail: os links não expiram, então dá pra baixar de novo sempre
          que precisar.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-10 lg:grid-cols-2">
        {PLANOS.itens.map((p) => (
          <Plano key={p.id} p={p} />
        ))}
      </div>
    </Secao>
  );
}
