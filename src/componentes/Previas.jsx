import { useRef } from "react";
import { Etiqueta, Secao, Subtitulo, Titulo } from "./Ui";

const PREVIAS = [
  { arq: "paginas/pt-01.webp", txt: "Caça-palavras temático", materia: "Português" },
  { arq: "paginas/ma-01.webp", txt: "Problemas com blocos", materia: "Matemática" },
  { arq: "paginas/pt-02.webp", txt: "Separação de sílabas", materia: "Português" },
  { arq: "paginas/ma-02.webp", txt: "Tabuada visual", materia: "Matemática" },
  { arq: "paginas/pt-03.webp", txt: "Classes de palavras", materia: "Português" },
  { arq: "paginas/ma-03.webp", txt: "Frações ilustradas", materia: "Matemática" },
  { arq: "paginas/pt-04.webp", txt: "Interpretação de texto", materia: "Português" },
  { arq: "paginas/ma-04.webp", txt: "Medidas e proporção", materia: "Matemática" },
];

export default function Previas() {
  const trilho = useRef(null);

  const rolar = (dir) => {
    const el = trilho.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <Secao id="previas" className="border-b-3 border-tinta bg-tinta">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Etiqueta cor="bg-ceu">Prévia real</Etiqueta>
          <Titulo className="titulo-claro mt-4">
            Veja as páginas que você vai imprimir
          </Titulo>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-papel/80 text-pretty">
            Cada atividade cabe em uma folha A4, com espaço de sobra para a criança
            escrever. Estas são páginas reais do material, ilustradas no mesmo
            universo de blocos — não são artes de vitrine.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => rolar(-1)}
            aria-label="Ver prévias anteriores"
            className="btn-bloco flex size-12 items-center justify-center rounded-md bg-papel text-2xl font-bold"
          >
            &#8592;
          </button>
          <button
            onClick={() => rolar(1)}
            aria-label="Ver próximas prévias"
            className="btn-bloco flex size-12 items-center justify-center rounded-md bg-papel text-2xl font-bold"
          >
            &#8594;
          </button>
        </div>
      </div>

      <div
        ref={trilho}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PREVIAS.map((p) => (
          <figure
            key={p.arq}
            className="w-[240px] shrink-0 snap-start sm:w-[280px]"
          >
            <div className="bloco relative overflow-hidden rounded-md bg-white">
              <img
                src={`/assets/${p.arq}`}
                alt={`Página de atividade: ${p.txt}`}
                className="aspect-[3/4] w-full object-cover"
                width="900"
                height="1200"
                loading="lazy"
              />
              <span className="bloco-sm absolute top-3 left-3 rounded-sm bg-ambar px-2 py-1 text-[10px] font-extrabold tracking-wide uppercase">
                {p.materia}
              </span>
            </div>
            <figcaption className="mt-3 text-center text-sm font-bold text-papel">
              {p.txt}
            </figcaption>
          </figure>
        ))}
      </div>
    </Secao>
  );
}
