import { OFERTA, PLANOS } from "../conteudo";
import { useContagem } from "../lib/useContagem";
import { precoBR } from "./Ui";

function Caixa({ valor, rotulo }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bloco-sm min-w-9 rounded-sm bg-tinta px-1.5 py-1 font-display text-base leading-none font-extrabold text-papel tabular-nums">
        {String(valor).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-bold tracking-wider uppercase opacity-70">
        {rotulo}
      </span>
    </div>
  );
}

export default function Topo() {
  const t = useContagem(OFERTA.fimDaPromocao, OFERTA.ativa);
  const completo = PLANOS.itens.find((p) => p.destaque);

  // Oferta encerrada → a barra some sozinha, sem precisar de deploy.
  if (t.expirado) return null;

  const desconto = Math.round(
    (1 - completo.preco / completo.precoDe) * 100,
  );

  return (
    <div className="sticky top-0 z-50 border-b-3 border-tinta bg-ambar">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-tinta">
        <p className="text-sm font-extrabold">
          Oferta de lançamento &mdash; {desconto}% off
          <span className="hidden sm:inline">
            {" "}
            &middot; R$ {precoBR(completo.preco)}
          </span>
        </p>
        <div className="flex items-end gap-1.5">
          {t.dias > 0 && <Caixa valor={t.dias} rotulo="dias" />}
          <Caixa valor={t.horas} rotulo="hrs" />
          <Caixa valor={t.minutos} rotulo="min" />
          <Caixa valor={t.segundos} rotulo="seg" />
        </div>
      </div>
    </div>
  );
}
