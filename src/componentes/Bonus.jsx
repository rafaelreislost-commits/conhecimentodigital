import { BONUS } from "../conteudo";
import { Etiqueta, Secao, Subtitulo, Titulo } from "./Ui";

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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BONUS.itens.map((b) => (
            <article key={b.id} className="painel-rpg flex flex-col overflow-hidden p-4">
              <img
                src={`/assets/${b.imagem}`}
                alt={b.titulo}
                className="aspect-square w-full rounded-sm border-2 border-ambar/50 object-cover shadow-md"
                width="700"
                height="700"
                loading="lazy"
              />
              <div className="mt-4">
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
