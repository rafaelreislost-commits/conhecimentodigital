import { DEPOIMENTOS } from "../conteudo";
import { Cartao, Etiqueta, Secao, Titulo } from "./Ui";

/**
 * Só renderiza quando houver depoimentos REAIS cadastrados em conteudo.js.
 * Enquanto a lista estiver vazia, a seção não existe na página — em vez de
 * exibir prova social inventada, que é o padrão do mercado e é enganoso.
 */
export default function Depoimentos() {
  const itens = DEPOIMENTOS.itens ?? [];
  if (!DEPOIMENTOS.mostrarSecao || itens.length === 0) return null;

  const media = (
    itens.reduce((s, d) => s + (d.nota ?? 5), 0) / itens.length
  ).toFixed(1);

  return (
    <Secao id="depoimentos" className="border-b-3 border-tinta bg-white">
      <Etiqueta cor="bg-ambar">Quem já usa</Etiqueta>
      <Titulo className="mt-4">{DEPOIMENTOS.titulo}</Titulo>
      <p className="mt-3 font-bold">
        Nota média {media.replace(".", ",")} &middot; {itens.length}{" "}
        {itens.length === 1 ? "avaliação" : "avaliações"}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {itens.map((d) => (
          <Cartao key={d.nome} className="flex flex-col bg-papel">
            <p className="text-ambar-escuro" aria-label={`Nota ${d.nota} de 5`}>
              {"★".repeat(d.nota ?? 5)}
              <span className="text-tinta/20">{"★".repeat(5 - (d.nota ?? 5))}</span>
            </p>
            <blockquote className="mt-3 grow leading-relaxed text-pretty">
              &ldquo;{d.texto}&rdquo;
            </blockquote>
            <footer className="mt-5 border-t-2 border-dashed border-tinta/20 pt-3 text-sm">
              <strong>{d.nome}</strong>
              {d.contexto && (
                <span className="text-tinta/60"> &middot; {d.contexto}</span>
              )}
            </footer>
          </Cartao>
        ))}
      </div>
    </Secao>
  );
}
