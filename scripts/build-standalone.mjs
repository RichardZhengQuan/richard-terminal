import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRequire = createRequire(path.join(projectDirectory, "package.json"));
const suppliedModules = process.env.STAGE_BUILD_MODULES;
const fallbackRequire = suppliedModules
  ? createRequire(path.join(path.dirname(path.resolve(suppliedModules)), "package.json"))
  : null;

// By default packages resolve from the project's dev dependencies. An explicitly
// supplied module directory allows an isolated build when local installs cannot
// be read, without changing the project's dependency files.
function resolveDependency(specifier) {
  const resolvers = fallbackRequire ? [fallbackRequire, projectRequire] : [projectRequire];
  for (const resolver of resolvers) {
    try {
      return resolver.resolve(specifier);
    } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
    }
  }
  throw new Error(
    `Cannot resolve ${specifier}. Install project dependencies, or set STAGE_BUILD_MODULES to a node_modules directory containing esbuild, react, and react-dom.`,
  );
}

async function buildStandalone() {
  const esbuildModule = await import(pathToFileURL(resolveDependency("esbuild")).href);
  const esbuild = esbuildModule.build ? esbuildModule : esbuildModule.default;
  const aliases = {
    "next/dynamic": path.join(projectDirectory, "scripts", "standalone-dynamic.tsx"),
  };

  if (fallbackRequire) {
    for (const specifier of [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
    ]) {
      aliases[specifier] = resolveDependency(specifier);
    }
  }

  const result = await esbuild.build({
    absWorkingDir: projectDirectory,
    entryPoints: ["scripts/standalone-entry.tsx"],
    tsconfig: path.join(projectDirectory, "tsconfig.json"),
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    alias: aliases,
    mainFields: ["browser", "module", "main"],
    minify: true,
    legalComments: "inline",
    metafile: true,
    plugins: [{
      name: "standalone-without-next-runtime",
      setup(build) {
        build.onResolve({ filter: /^next(?:\/|$)/ }, ({ path: specifier }) => specifier === "next/dynamic"
          ? { path: aliases["next/dynamic"] }
          : { errors: [{ text: `The standalone stage cannot depend on ${specifier}.` }] });
      },
    }],
  });

  for (const output of Object.values(result.metafile.outputs)) {
    if (output.imports.some((dependency) => dependency.external)) {
      throw new Error("The standalone bundle still contains an external dependency.");
    }
  }

  const font = await readFile(path.join(projectDirectory, "public", "fonts", "inter-latin.woff2"));
  const css = (await Promise.all(["globals.css", "journey.css"].map(filename => readFile(path.join(projectDirectory, "src", "app", filename), "utf8")))).join("\n")
    .replaceAll("/fonts/inter-latin.woff2", `data:font/woff2;base64,${font.toString("base64")}`)
    .replace(/^[ \t]*@tailwind[ \t]+(?:base|components|utilities)[ \t]*;[ \t]*(?:\r?\n)?/gm, "");
  if (/@import\s|url\(\s*["']?(?:https?:|\/\/)/i.test(css)) {
    throw new Error("The standalone CSS must not import external assets.");
  }

  let javascript = result.outputFiles[0].text;
  const cardAssetDirectory = path.join(projectDirectory, "public", "project-card-assets");
  for (const filename of await readdir(cardAssetDirectory)) {
    if (!/\.(webp|svg)$/.test(filename)) continue;
    const asset = await readFile(path.join(cardAssetDirectory, filename));
    const mime = filename.endsWith(".svg") ? "image/svg+xml" : "image/webp";
    javascript = javascript.replaceAll(`/project-card-assets/${filename}`, `data:${mime};base64,${asset.toString("base64")}`);
  }
  if (javascript.includes("/project-card-assets/")) throw new Error("A card asset is missing from the standalone bundle.");
  const inlineJavascript = javascript.replace(/<\/script/gi, "<\\/script");
  const inlineCss = css.replace(/<\/style/gi, "<\\/style");
  const iconData = async (filename, mime) => `data:${mime};base64,${(await readFile(path.join(projectDirectory, "public", filename))).toString("base64")}`;
  const [faviconSvg, faviconPng, appleIcon] = await Promise.all([
    iconData("favicon.svg", "image/svg+xml"),
    iconData("favicon-32x32.png", "image/png"),
    iconData("apple-touch-icon.png", "image/png"),
  ]);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <script>try{const t=localStorage.getItem("richard-resume-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}</script>
  <meta name="theme-color" content="#f7f7f5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#121211" media="(prefers-color-scheme: dark)">
  <meta name="description" content="Richard Q’s bilingual personal page and project portfolio. Explore practical AI tools, agent systems, native apps, and product design work.">
  <title>Richard Q — Product Manager &amp; Projects</title>
  <link rel="icon" type="image/png" sizes="32x32" href="${faviconPng}">
  <link rel="icon" type="image/svg+xml" sizes="any" href="${faviconSvg}">
  <link rel="apple-touch-icon" sizes="180x180" href="${appleIcon}">
  <style>${inlineCss}</style>
</head>
<body>
  <div id="root"></div>
  <noscript><p style="padding:2rem">Please enable JavaScript to view the personal page. / 请启用 JavaScript，浏览个人主页与项目。</p></noscript>
  <script>${inlineJavascript}</script>
</body>
</html>
`;

  const outputDirectory = path.join(projectDirectory, "standalone");
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDirectory, "stage-show.html"), html),
    writeFile(path.join(outputDirectory, "stage-show.css"), css),
    writeFile(path.join(outputDirectory, "stage-show.js"), javascript),
  ]);
  console.log(`Built standalone/stage-show.html (${Math.round(Buffer.byteLength(html) / 1024)} KiB), with companion CSS and JavaScript.`);
}

buildStandalone().catch((error) => {
  console.error(`Standalone build failed: ${error.message}`);
  process.exitCode = 1;
});
