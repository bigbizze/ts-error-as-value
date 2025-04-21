// build.js
import { build } from 'esbuild'

Promise.all([
  // ESM
  build({
    entryPoints: ['./src/index.ts', './src/globals.js'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    minify: true,
    outdir: 'dist/esm'
  }),
  // CJS
  build({
    entryPoints: ['./src/index.ts', './src/globals.js'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    outdir: 'dist/cjs'
  })
]).catch(() => process.exit(1))
