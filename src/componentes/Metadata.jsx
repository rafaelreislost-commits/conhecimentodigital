import { useEffect } from "react";
import { metadataFor, SITE_URL } from "../lib/metadata";

function setMeta(attribute, name, content) {
  const selector = `meta[${attribute}="${name}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
  element.dataset.routeMetadata = "true";
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
  element.dataset.routeMetadata = "true";
}

export default function Metadata() {
  useEffect(() => {
    const page = metadataFor(window.location.pathname);
    const url = `${SITE_URL}${page.pathname === "/" ? "/" : page.pathname}`;
    const image = new URL(page.image, SITE_URL).href;

    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("name", "robots", page.robots);
    setCanonical(url);

    setMeta("property", "og:type", "website");
    setMeta("property", "og:locale", "pt_BR");
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", "Mundo dos Blocos");
    setMeta("property", "og:title", page.ogTitle);
    setMeta("property", "og:description", page.ogDescription);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:alt", page.imageAlt);
    setMeta("property", "og:image:width", page.imageWidth);
    setMeta("property", "og:image:height", page.imageHeight);
    setMeta("property", "og:image:type", page.imageType);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", page.ogTitle);
    setMeta("name", "twitter:description", page.ogDescription);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:url", url);
  }, []);

  return null;
}
