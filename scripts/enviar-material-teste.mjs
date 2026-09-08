// Dispara o e-mail de entrega REAL (mesma função do webhook) para um endereço
// de teste, sem depender de uma compra. Usa o template e o caminho de envio de
// produção (SendGrid + domínio autenticado).
//
//   node --env-file=.env.local scripts/enviar-material-teste.mjs [email] [plano]
//
// Defaults: conhecimentodigital67@gmail.com / basico
import { PLANOS } from "../api/_planos.js";
import { enviarEmailComMateriais } from "../api/_email-entrega.js";

const destino = process.argv[2] || "conhecimentodigital67@gmail.com";
const planoId = process.argv[3] || "basico";
const plano = PLANOS[planoId];

if (!plano) {
  console.error(`Plano inválido: ${planoId}. Opções: ${Object.keys(PLANOS).join(", ")}`);
  process.exit(1);
}
if (!process.env.SENDGRID_FROM) process.env.SENDGRID_FROM = "material@conhecimentodigital.net";
if (!process.env.EMAIL_RESPOSTA) process.env.EMAIL_RESPOSTA = "contato@conhecimentodigital.net";

console.log(`Enviando "${plano.titulo}" para ${destino} ...`);
await enviarEmailComMateriais({ email: destino, plano });
console.log("OK — enviado.");
