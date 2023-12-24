import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./index.cjs'],
  outfile: './dist/bundle.cjs',
  bundle: true,
  platform: 'node',
  target: 'node14',
  format: 'cjs',
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  minify: true
})