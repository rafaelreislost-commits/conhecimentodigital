import { useEffect, useState } from "react";
import { PLANOS } from "../conteudo";
import { precoBR } from "./Ui";

/**
 * CTA fixa no rodapé, só no mobile. Aparece depois que a pessoa rolou o
 * primeiro dobra e some quando a seção de planos entra em cena (para não
 * cobrir os próprios botões de compra).
 */
export default function BarraMobile() {
  const [visivel, setVisivel] = useState(false);
  const completo = PLANOS.itens.find((p) => p.destaque);

  useEffect(() => {
    const planos = document.getElementById("planos");

    const aoRolar = () => {
      const passouDobra = window.scrollY > window.innerHeight * 0.9;
      const emPlanos = planos
        ? planos.getBoundingClientRect().top < window.innerHeight &&
          planos.getBoundingClientRect().bottom > 0
        : false;
      setVisivel(passouDobra && !emPlanos);
    };

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t-3 border-tinta bg-papel p-3 transition-transform duration-200 lg:hidden ${
        visivel ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-tinta/60 uppercase">
            Pacote completo
          </p>
          <p className="font-display text-xl leading-none font-extrabold">
            R$ {precoBR(completo.preco)}
          </p>
        </div>
        <a
          href="#planos"
          className="btn-bloco grow rounded-md bg-ambar px-4 py-3 text-center font-display font-extrabold"
        >
          Quero agora
        </a>
      </div>
    </div>
  );
}
