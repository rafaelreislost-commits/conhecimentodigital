import { PARA_QUEM } from "../conteudo";
import { Cartao, Etiqueta, Secao, Subtitulo, Titulo } from "./Ui";

const CORES = ["bg-grama", "bg-ceu", "bg-cristal", "bg-terra", "bg-ambar", "bg-energia"];

export default function ParaQuem() {
  return (
    <Secao id="para-quem" className="border-b-3 border-tinta">
      <Etiqueta cor="bg-grama">Para quem serve</Etiqueta>
      <Titulo className="mt-4">{PARA_QUEM.titulo}</Titulo>
      <Subtitulo>{PARA_QUEM.subtitulo}</Subtitulo>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PARA_QUEM.itens.map((item, i) => (
          <Cartao key={item.titulo} className="flex flex-col">
            <div
              className={`bloco-sm mb-5 flex size-16 items-center justify-center rounded-md ${CORES[i % CORES.length]}`}
            >
              <img
                src={`/assets/icone-${item.icone}.svg`}
                alt=""
                className="size-10"
                width="120"
                height="120"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl">{item.titulo}</h3>
            <p className="mt-2.5 leading-relaxed text-tinta/75">{item.texto}</p>
          </Cartao>
        ))}
      </div>
    </Secao>
  );
}
