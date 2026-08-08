import { BONUS } from "../conteudo";
import { Etiqueta, Secao, Subtitulo, Titulo } from "./Ui";

// Os PDFs de bônus ainda não têm arte própria pronta — por enquanto, cada
// bônus ganha um personagem do elenco como apoio visual, sobre um painel
// dourado estilo RPG que já usa a nova linguagem visual do produto.
const PERSONAGEM_POR_BONUS = {
  mapa: "explorador",
  cartoes: "construtora",
  guia: "leitora",
  plano: "leitor",
};

export default function Bonus() {
  return (
    <Secao id="bonus" className="relative overflow-hidden border-b-3 border-tinta bg-tinta">
      <img
        src="/assets/modulo-3.webp"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tinta/70 via-tinta/85 to-tinta"
        aria-hidden="true"
      />

      <div className="relative">
        <Etiqueta cor="bg-energia">
          <span className="text-papel">Incluso no pacote completo</span>
        </Etiqueta>
        <Titulo className="titulo-3d mt-4">{BONUS.titulo}</Titulo>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-papel/80 text-pretty">
          {BONUS.subtitulo}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {BONUS.itens.map((b) => (
            <article
              key={b.id}
              className="painel-rpg relative flex gap-5 overflow-visible p-6 pt-8"
            >
              <img
                src={`/assets/${PERSONAGEM_POR_BONUS[b.id] ?? "mascote"}.webp`}
                alt=""
                className="absolute -top-8 -left-2 h-28 w-auto shrink-0 drop-shadow-lg sm:h-32"
                width="2048"
                height="3072"
                loading="lazy"
              />
              <div className="ml-24 sm:ml-28">
                <span className="text-xs font-extrabold tracking-wider text-ambar uppercase">
                  Extra {b.numero}
                </span>
                <h3 className="titulo-3d mt-1 text-xl">{b.titulo}</h3>
                <p className="mt-2 leading-relaxed text-papel/85">{b.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Secao>
  );
}
