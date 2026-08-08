// Vercel Serverless Function — cria uma Preference no Mercado Pago (Checkout Pro)
// e devolve a URL de pagamento (init_point). O Access Token nunca sai do servidor.
//
// Configurar na Vercel: Project Settings → Environment Variables → MP_ACCESS_TOKEN
import { MercadoPagoConfig, Preference } from "mercadopago";
import { PLANOS } from "./_planos.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const planoId = req.method === "GET" ? req.query.plano : req.body?.plano;
  const plano = PLANOS[planoId];

  if (!plano) {
    return res.status(400).json({ erro: "Plano inválido" });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ erro: "MP_ACCESS_TOKEN não configurado no servidor" });
  }

  const origem = `https://${req.headers.host}`;

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const resultado = await preference.create({
      body: {
        items: [
          {
            id: planoId,
            title: plano.titulo,
            quantity: 1,
            unit_price: plano.preco,
            currency_id: "BRL",
          },
        ],
        // Identifica o plano comprado para o webhook, sem depender do item.
        external_reference: planoId,
        back_urls: {
          success: `${origem}/obrigado`,
          failure: `${origem}/?pagamento=falhou`,
          pending: `${origem}/?pagamento=pendente`,
        },
        auto_return: "approved",
        statement_descriptor: "MUNDO DOS BLOCOS",
        notification_url: `${origem}/api/webhook-mp`,
      },
    });

    return res.status(200).json({ init_point: resultado.init_point });
  } catch (erro) {
    console.error("Erro ao criar preferência Mercado Pago:", erro);
    return res.status(500).json({ erro: "Não foi possível iniciar o pagamento" });
  }
}
