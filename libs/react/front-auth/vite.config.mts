/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/libs/react/front-auth',
  plugins: [
    react(),
    dts({ entryRoot: 'src', tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json') }),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: 'src/index.ts',
      name: 'front-auth',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  resolve: {
    // Use source exports for sibling libs so tests don't need a prior build
    conditions: ['@mas-repo/source', 'module', 'browser', 'default'],
    alias: {
      // tsconfig path aliases — needed so @mas/react-ui source imports resolve in tests
      '@mas/shared/theme': path.resolve(import.meta.dirname, '../../../libs/shared/theme/src/index.ts'),
      '@mas/shared/i18n': path.resolve(import.meta.dirname, '../../../libs/shared/i18n/src/index.ts'),
      '@mas/react-ui': path.resolve(import.meta.dirname, '../ui/src/index.ts'),
    },
  },
  test: {
    name: 'front-auth',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
