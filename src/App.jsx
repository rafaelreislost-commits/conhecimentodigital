import { useEffect } from "react";
import { iniciarPixel } from "./lib/pixel";
import { iniciarTiktokPixel } from "./lib/tiktokPixel";
import Obrigado from "./paginas/Obrigado";
import AventuraNaFe from "./paginas/AventuraNaFe";

import Topo from "./componentes/Topo";
import FaixaPromoFe from "./componentes/FaixaPromoFe";
import Hero from "./componentes/Hero";
import Previas from "./componentes/Previas";
import ParaQuem from "./componentes/ParaQuem";
import Modulos from "./componentes/Modulos";
import Bonus from "./componentes/Bonus";
import Depoimentos from "./componentes/Depoimentos";
import Planos from "./componentes/Planos";
import Garantia from "./componentes/Garantia";
import Faq from "./componentes/Faq";
import CtaFinal from "./componentes/CtaFinal";
import OutrosProjetos from "./componentes/OutrosProjetos";
import Rodape from "./componentes/Rodape";
import BarraMobile from "./componentes/BarraMobile";

export default function App() {
  useEffect(iniciarPixel, []);
  useEffect(iniciarTiktokPixel, []);

  if (window.location.pathname === "/obrigado") {
    return <Obrigado />;
  }

  if (window.location.pathname === "/aventura-na-fe") {
    return <AventuraNaFe />;
  }

  return (
    <>
      <Topo />
      <FaixaPromoFe />
      <main>
        <Hero />
        <Previas />
        <ParaQuem />
        <Modulos />
        <Bonus />
        <Depoimentos />
        <Planos />
        <Garantia />
        <Faq />
        <CtaFinal />
        <OutrosProjetos />
      </main>
      <Rodape />
      <BarraMobile />
    </>
  );
}
