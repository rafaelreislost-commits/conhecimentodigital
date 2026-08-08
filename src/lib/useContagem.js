import { useEffect, useState } from "react";

/**
 * Contagem regressiva até uma data FIXA e real.
 *
 * Deliberadamente não é o padrão "timer que reinicia a cada visita": aquilo é
 * publicidade enganosa (CDC art. 37) e motivo comum de reprovação no Meta Ads.
 * Quando a data passa, `expirado` vira true e a página some com a oferta
 * sozinha — sem precisar de deploy.
 */
export function useContagem(dataISO, ativa = true) {
  const alvo = dataISO ? new Date(dataISO).getTime() : null;
  const calcular = () => (alvo ? alvo - Date.now() : 0);
  const [restante, setRestante] = useState(calcular);

  useEffect(() => {
    if (!alvo || !ativa) return;
    const id = setInterval(() => setRestante(calcular()), 1000);
    return () => clearInterval(id);
  }, [alvo, ativa]);

  const expirado = !alvo || !ativa || restante <= 0;
  const total = Math.max(0, restante);

  return {
    expirado,
    dias: Math.floor(total / 86400000),
    horas: Math.floor((total / 3600000) % 24),
    minutos: Math.floor((total / 60000) % 60),
    segundos: Math.floor((total / 1000) % 60),
  };
}
