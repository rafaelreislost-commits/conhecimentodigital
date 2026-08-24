export default function FaixaPromoFe() {
  return (
    <a
      href="/aventura-na-fe"
      className="group flex items-center justify-center gap-2 border-b-3 border-tinta bg-cristal px-4 py-2.5 text-center text-sm font-bold text-papel hover:bg-cristal/90"
    >
      <span aria-hidden="true">📖</span>
      <span>
        Conheça também o <span className="underline underline-offset-2">Aventura na Fé</span> —
        histórias bíblicas em quadrinhos
      </span>
      <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        →
      </span>
    </a>
  );
}
