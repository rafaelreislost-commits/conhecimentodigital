import { useEffect } from "react";
import { iniciarPixel } from "./lib/pixel";

import Topo from "./componentes/Topo";
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
import Rodape from "./componentes/Rodape";
import BarraMobile from "./componentes/BarraMobile";

export default function App() {
  useEffect(iniciarPixel, []);

  return (
    <>
      <Topo />
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
      </main>
      <Rodape />
      <BarraMobile />
    </>
  );
}
