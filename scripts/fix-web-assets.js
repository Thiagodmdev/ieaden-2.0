/**
 * Roda depois de `expo export -p web`.
 *
 * O Metro coloca os assets de dependências (ex.: fontes do @expo/vector-icons)
 * em `dist/assets/node_modules/...`. A Vercel ignora pastas `node_modules` no
 * deploy, então essas fontes davam 404 e os ícones não apareciam.
 * Aqui movemos a pasta para `dist/assets/vendor` e atualizamos as referências.
 */
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const ORIGEM = path.join(DIST, "assets", "node_modules");
const DESTINO = path.join(DIST, "assets", "vendor");

if (!fs.existsSync(ORIGEM)) {
  console.log("fix-web-assets: nada para mover.");
  process.exit(0);
}

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.renameSync(ORIGEM, DESTINO);

function arquivosDeTexto(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) return arquivosDeTexto(caminho);
    return /\.(js|html|json|css)$/.test(item.name) ? [caminho] : [];
  });
}

let alterados = 0;
for (const arquivo of arquivosDeTexto(DIST)) {
  const conteudo = fs.readFileSync(arquivo, "utf8");
  if (!conteudo.includes("/assets/node_modules/")) continue;
  fs.writeFileSync(arquivo, conteudo.replaceAll("/assets/node_modules/", "/assets/vendor/"));
  alterados++;
}

console.log(`fix-web-assets: assets movidos para assets/vendor (${alterados} arquivo(s) atualizado(s)).`);
