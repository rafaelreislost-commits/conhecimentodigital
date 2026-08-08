import { GARANTIA } from "../conteudo";
import { Secao } from "./Ui";

export default function Garantia() {
  return (
    <Secao className="border-b-3 border-tinta bg-white">
      <div className="bloco mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-md bg-papel p-8 text-center sm:p-12 md:flex-row md:text-left">
        <div className="bloco-sm relative flex size-44 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ambar/25">
          <img
            src="/assets/mascote.webp"
            alt="Mascote do Mundo dos Blocos acenando"
            className="size-full object-cover object-bottom"
            width="2048"
            height="2048"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl">{GARANTIA.titulo}</h2>
          {GARANTIA.texto.map((t) => (
            <p key={t} className="mt-3 text-lg leading-relaxed text-tinta/80">
              {t}
            </p>
          ))}
        </div>
      </div>
    </Secao>
  );
}
