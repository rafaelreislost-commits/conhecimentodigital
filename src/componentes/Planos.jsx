import { useState } from "react";
import { PLANOS } from "../conteudo";
import { rastrearCheckout } from "../lib/pixel";
import { Etiqueta, Marcador, Secao, Subtitulo, Titulo, precoBR } from "./Ui";

async function iniciarPagamento(p) {
  const resposta = await fetch(`/api/criar-pagamento?plano=${p.id}`);
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
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);
  const economia = p.precoDe - p.preco;
  const capas = p.destaque
    ? ["/assets/completo.webp"]
    : ["/assets/portugues.webp", "/assets/matematica.webp"];

  async function aoClicar() {
    setErro(false);
    setCarregando(true);
    rastrearCheckout(p);
    try {
      await iniciarPagamento(p);
    } catch {
      setErro(true);
      setCarregando(false);
    }
  }

  return (
    <article
      className={`bloco relative flex flex-col rounded-md p-7 sm:p-8 ${
        p.destaque ? "bg-white lg:-mt-4 lg:mb-4" : "bg-papel"
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

      <button
        type="button"
        onClick={aoClicar}
        disabled={carregando}
        className={`btn-bloco mt-8 block rounded-md px-6 py-4 text-center font-display text-lg font-extrabold disabled:cursor-wait disabled:opacity-70 ${
          p.destaque ? "bg-ambar" : "bg-white"
        }`}
      >
        {carregando
          ? "Abrindo pagamento..."
          : p.destaque
            ? "Quero o pacote completo"
            : "Quero só o material"}
      </button>

      {erro && (
        <p className="mt-2 text-center text-xs font-bold text-energia">
          Não foi possível abrir o pagamento. Tente novamente.
        </p>
      )}

      <p className="mt-3 text-center text-xs font-semibold text-tinta/60">
        Pagamento único &middot; Pix ou cartão &middot; acesso imediato
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

      <div className="mx-auto mt-14 grid max-w-4xl items-start gap-8 lg:grid-cols-2">
        {PLANOS.itens.map((p) => (
          <Plano key={p.id} p={p} />
        ))}
      </div>
    </Secao>
  );
}
