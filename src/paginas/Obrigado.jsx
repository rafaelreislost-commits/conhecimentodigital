import { PRODUTO } from "../conteudo";
import { Botao } from "../componentes/Ui";

export default function Obrigado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ceu/20 px-5 py-16 text-center sm:px-8">
      <img
        src="/assets/mascote.webp"
        alt=""
        className="h-32 w-auto drop-shadow-lg sm:h-40"
        width="2048"
        height="2048"
        aria-hidden="true"
      />

      <h1 className="titulo-3d mt-6 text-3xl leading-tight sm:text-4xl">
        Pagamento feito com sucesso! ✅
      </h1>

      <div className="bloco mt-8 max-w-xl rounded-md bg-white p-6 sm:p-8">
        <p className="text-lg leading-relaxed font-semibold text-tinta/85">
          O material já está a caminho do seu e-mail — o mesmo que você
          usou no pagamento.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-tinta/65">
          Não achou? Confere a caixa de spam/promoções. Se em 15 minutos
          ainda não chegou nada, responde qualquer e-mail nosso ou entra em
          contato que a gente reenvia na hora.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-tinta/65">
          Se pagou no <strong>Pix</strong>, a confirmação costuma ser
          instantânea. No <strong>cartão</strong>, pode levar alguns minutos
          para o banco aprovar.
        </p>
      </div>

      <p className="mt-8 text-sm font-semibold text-tinta/60">
        Guarda esse e-mail — os links de download são vitalícios, dá pra
        baixar de novo quando quiser.
      </p>

      <Botao href="/" className="mt-8">
        Voltar para o {PRODUTO.nome}
      </Botao>
    </main>
  );
}
