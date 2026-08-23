export default function OutrosProjetos() {
  return (
    <section className="border-b-3 border-tinta bg-papel px-5 py-10 sm:px-8">
      <a
        href="/aventura-na-fe"
        className="bloco group mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-md bg-white p-5 transition-transform hover:-translate-y-0.5 sm:flex-row sm:p-6"
      >
        <img
          src="/assets/aventura-na-fe/af-00-capa.png"
          alt=""
          className="bloco-sm h-28 w-auto shrink-0 rounded-sm object-cover"
          width="1653"
          height="2339"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-extrabold tracking-wide text-cristal uppercase">
            Conheça também
          </p>
          <h3 className="font-body mt-1 text-xl font-bold text-tinta sm:text-2xl">
            Aventura na Fé — 25 histórias bíblicas em quadrinhos
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-tinta/70">
            Outro material da Conhecimento Digital: histórias bíblicas em quadrinhos
            com atividades, para crianças de 3 a 10 anos.
          </p>
        </div>
        <span className="btn-bloco shrink-0 rounded-md bg-cristal px-6 py-3 text-center font-display text-sm font-extrabold text-papel">
          Conhecer
        </span>
      </a>
    </section>
  );
}
