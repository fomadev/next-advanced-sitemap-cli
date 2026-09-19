import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', cli: 'src/cli.ts' },
  format: ['cjs', 'esm'],
  dts: { resolve: true, compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: false,
  sourcemap: true,
  clean: true,
  platform: 'node',
  banner: { js: '#!/usr/bin/env node' },
});
