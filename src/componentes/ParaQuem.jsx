import { PARA_QUEM } from "../conteudo";
import { Cartao, Etiqueta, Secao, Subtitulo, Titulo } from "./Ui";

export default function ParaQuem() {
  return (
    <Secao id="para-quem" className="relative border-b-3 border-tinta">
      <img
        src="/assets/sticker-boneco-leitora.webp"
        alt=""
        className="pointer-events-none absolute top-6 right-4 hidden w-24 -rotate-6 rounded-md border-2 border-tinta shadow-lg sm:block lg:w-28"
        width="300"
        height="364"
        aria-hidden="true"
      />
      <Etiqueta cor="bg-grama">Para quem serve</Etiqueta>
      <Titulo className="mt-4">{PARA_QUEM.titulo}</Titulo>
      <Subtitulo>{PARA_QUEM.subtitulo}</Subtitulo>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PARA_QUEM.itens.map((item, i) => (
          <Cartao key={item.titulo} className="flex flex-col">
            <img
              src={`/assets/icone-${item.icone}.webp`}
              alt=""
              className="flutuar bloco-sm mb-5 size-16 rounded-md"
              style={{ "--atraso": `${(i % 3) * 0.4}s` }}
              width="300"
              height="300"
              loading="lazy"
            />
            <h3 className="text-xl">{item.titulo}</h3>
            <p className="mt-2.5 leading-relaxed text-tinta/75">{item.texto}</p>
          </Cartao>
        ))}
      </div>
    </Secao>
  );
}
