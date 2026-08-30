import { rename } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");

await rename(
  path.join(distDir, "index.html"),
  path.join(distDir, "app-shell.html"),
);
