import * as esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "dist/main.js",
});
