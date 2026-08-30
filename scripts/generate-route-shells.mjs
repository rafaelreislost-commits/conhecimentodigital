import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { metadataFor, SITE_URL } from "../src/lib/metadata.js";

const dist = join(process.cwd(), "dist");
const indexPath = join(dist, "index.html");
const routes = ["/aventura-na-fe", "/obrigado"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, attribute, name, content) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}=["']${escapeRegExp(name)}["'])[^>]*\\/?\\s*>`, "i");
  const tag = `<meta ${attribute}="${name}" content="${content}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function createShell(index, pathname) {
  const page = metadataFor(pathname);
  const url = `${SITE_URL}${pathname}`;
  const image = new URL(page.image, SITE_URL).href;
  let html = index.replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`);

  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "name", "robots", page.robots);
  html = html.replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*\/?\s*>/i, `<link rel="canonical" href="${url}" />`);
  html = setMeta(html, "property", "og:type", "website");
  html = setMeta(html, "property", "og:locale", "pt_BR");
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:site_name", "Mundo dos Blocos");
  html = setMeta(html, "property", "og:title", page.ogTitle);
  html = setMeta(html, "property", "og:description", page.ogDescription);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "property", "og:image:alt", page.imageAlt);
  html = setMeta(html, "property", "og:image:width", page.imageWidth);
  html = setMeta(html, "property", "og:image:height", page.imageHeight);
  html = setMeta(html, "property", "og:image:type", page.imageType);
  html = setMeta(html, "name", "twitter:card", "summary_large_image");
  html = setMeta(html, "name", "twitter:title", page.ogTitle);
  html = setMeta(html, "name", "twitter:description", page.ogDescription);
  html = setMeta(html, "name", "twitter:image", image);
  html = setMeta(html, "name", "twitter:url", url);
  return html;
}

const index = await readFile(indexPath, "utf8");
for (const route of routes) {
  const directory = join(dist, route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), createShell(index, route));
}
