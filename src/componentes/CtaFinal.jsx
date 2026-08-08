import { HERO, PLANOS, PRODUTO } from "../conteudo";
import { Botao, Cubo, precoBR } from "./Ui";

export default function CtaFinal() {
  const completo = PLANOS.itens.find((p) => p.destaque);

  return (
    <section className="relative overflow-hidden border-b-3 border-tinta bg-tinta px-5 py-20 text-papel sm:px-8">
      <img
        src="/assets/modulo-5.webp"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tinta/70 via-tinta/80 to-tinta/95"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <img
          src="/assets/mascote.webp"
          alt=""
          className="mb-4 h-24 w-auto drop-shadow-lg"
          width="2048"
          height="2048"
          loading="lazy"
        />
        <div className="mb-6 flex gap-2">
          {["#F2A93B", "#FDF6E8", "#4FA3D9"].map((c) => (
            <Cubo key={c} cor={c} tamanho={28} />
          ))}
        </div>

        <h2
          className="text-3xl leading-tight font-extrabold text-balance text-papel sm:text-4xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Amanhã ele pode estar na mesa ou no quarto, resolvendo
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-papel/90 text-pretty">
          {PRODUTO.totalAtividades} atividades prontas para imprimir hoje mesmo. Por
          R$ {precoBR(completo.preco)}, uma vez só, para sempre.
        </p>

        <Botao href="#planos" className="mt-9">
          {HERO.cta}
        </Botao>

        <p className="mt-4 text-sm font-semibold text-papel/80">
          Acesso imediato &middot; entrega por e-mail &middot; sem assinatura
        </p>
      </div>
    </section>
  );
}
