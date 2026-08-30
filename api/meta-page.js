const SITE_URL = "https://conhecimentodigital.vercel.app/";

export default async function handler(_request, response) {
  const source = await fetch(`${SITE_URL}app-shell.html?_origin=1`, {
    headers: { "User-Agent": "ConhecimentoDigital-Meta-Shell/1.0" },
  });

  if (!source.ok) {
    response.statusCode = 502;
    response.end("Unable to load page shell");
    return;
  }

  const html = Buffer.from(await source.arrayBuffer());

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Content-Length", String(html.length));
  response.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  response.end(html);
}
