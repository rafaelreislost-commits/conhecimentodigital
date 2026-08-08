import { MODULOS, PRODUTO } from "../conteudo";
import { Etiqueta, Secao, Subtitulo, Titulo } from "./Ui";

export default function Modulos() {
  return (
    <Secao id="modulos" className="border-b-3 border-tinta bg-white">
      <Etiqueta cor="bg-cristal">Conteúdo completo</Etiqueta>
      <Titulo className="mt-4">{MODULOS.titulo}</Titulo>
      <Subtitulo>{MODULOS.subtitulo}</Subtitulo>

      <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULOS.itens.map((m) => (
          <li
            key={m.id}
            className="bloco group relative flex flex-col overflow-hidden rounded-md transition-transform hover:-translate-y-1"
          >
            <div className="relative h-56 shrink-0 overflow-hidden border-b-3 border-tinta">
              <img
                src={`/assets/modulo-${m.id}.webp`}
                alt=""
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                width="1600"
                height="1200"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/10 to-transparent"
                aria-hidden="true"
              />
              <span className="bloco-sm absolute top-3 right-3 rounded-sm bg-ambar px-2.5 py-1 text-xs font-extrabold whitespace-nowrap">
                {m.selo}
              </span>
              <h3 className="titulo-3d absolute inset-x-4 bottom-3 text-xl">
                {m.titulo}
              </h3>
            </div>

            <div className="flex grow flex-col bg-papel p-6">
              <p className="grow leading-relaxed text-tinta/75">{m.texto}</p>

              <p className="mt-5 border-t-2 border-dashed border-tinta/20 pt-3 text-sm font-bold text-tinta/60">
                {m.atividades} atividades
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-center text-lg font-bold">
        Total: {PRODUTO.totalAtividades} atividades &middot;{" "}
        {PRODUTO.totalPaginas} páginas &middot; gabarito completo incluso
      </p>
    </Secao>
  );
}
