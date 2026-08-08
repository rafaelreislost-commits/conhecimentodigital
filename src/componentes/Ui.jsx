/** Primitivas visuais compartilhadas — o "design system" da página. */

export function Secao({ id, className = "", children }) {
  return (
    <section id={id} className={`px-5 py-16 sm:px-8 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Etiqueta({ children, cor = "bg-ambar" }) {
  return (
    <span
      className={`bloco-sm inline-block rounded-sm ${cor} px-3 py-1 text-xs font-extrabold tracking-wide text-tinta uppercase`}
    >
      {children}
    </span>
  );
}

export function Titulo({ children, className = "" }) {
  return (
    <h2
      className={`text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl ${className}`}
    >
      {children}
    </h2>
  );
}

export function Subtitulo({ children }) {
  return (
    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-tinta/75 text-pretty">
      {children}
    </p>
  );
}

export function Cartao({ className = "", children }) {
  return (
    <div className={`bloco rounded-md bg-white p-6 ${className}`}>{children}</div>
  );
}

export function Botao({ como = "a", className = "", children, ...props }) {
  const Tag = como;
  return (
    <Tag
      className={`btn-bloco inline-flex items-center justify-center gap-2 rounded-md bg-ambar px-7 py-4 text-center font-display text-lg font-extrabold text-tinta select-none ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Cubo isométrico decorativo, desenhado em CSS puro (sem custo de request). */
export function Cubo({ tamanho = 16, cor = "#5BA83F", className = "" }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <path d="M32 4 58 18 32 32 6 18Z" fill={cor} stroke="#2B2118" strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 18 32 32 32 60 6 46Z" fill={cor} fillOpacity="0.75" stroke="#2B2118" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 32 58 18 58 46 32 60Z" fill={cor} fillOpacity="0.5" stroke="#2B2118" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function Marcador({ ok = true }) {
  return ok ? (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#5BA83F" stroke="#2B2118" strokeWidth="2.5" />
      <path d="m7 12 3.5 3.5L17 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="square" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#FDF6E8" stroke="#9AA0A6" strokeWidth="2.5" />
      <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="#9AA0A6" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}

export function precoBR(v) {
  return v.toFixed(2).replace(".", ",");
}
