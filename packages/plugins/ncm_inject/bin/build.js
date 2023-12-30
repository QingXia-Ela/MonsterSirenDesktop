import * as esbuild from 'esbuild'
import * as vite from 'vite'

const logger = vite.createLogger("info", {
  prefix: "[ncm_inject]",
})

// bundle node
await esbuild.build({
  entryPoints: ['./src-node/index.cjs'],
  outfile: './dist/bundle.cjs',
  bundle: true,
  platform: 'node',
  target: 'node14',
  format: 'cjs',
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  minify: true,
})

logger.info('build node code ./dist/bundle.cjs success')

// bundle browser settings render
esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist-browser/index.js',
  platform: 'browser',
  target: 'chrome105',
  format: 'cjs',
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  minify: true,
})

logger.info('build browser settings code ./dist-browser/index.js success')
