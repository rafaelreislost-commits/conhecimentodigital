import { FAQ } from "../conteudo";
import { Etiqueta, Secao, Titulo } from "./Ui";

export default function Faq() {
  return (
    <Secao id="faq" className="border-b-3 border-tinta bg-white">
      <div className="mx-auto max-w-3xl">
        <Etiqueta cor="bg-pedra">Dúvidas</Etiqueta>
        <Titulo className="mt-4">{FAQ.titulo}</Titulo>

        <div className="mt-10 space-y-4">
          {FAQ.itens.map((item) => (
            <details
              key={item.p}
              name="faq"
              className="bloco group rounded-md bg-papel open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-3xl leading-tight font-extrabold [&::-webkit-details-marker]:hidden">
                {item.p}
                <span
                  className="bloco-sm flex size-10 shrink-0 items-center justify-center rounded-sm bg-ambar text-2xl leading-none transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="border-t-2 border-dashed border-tinta/20 px-5 py-4 text-lg leading-relaxed text-tinta/80">
                {item.r}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Secao>
  );
}
