/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/react-fundamentals',
  server: {
    port: 4205,
    host: 'localhost',
  },
  preview: {
    port: 4205,
    host: 'localhost',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@mas/react-ui':       resolve(__dirname, '../../libs/react/ui/src/index.ts'),
      '@mas/shared/qcm':     resolve(__dirname, '../../libs/shared/qcm/src/index.ts'),
      '@mas/shared/store':   resolve(__dirname, '../../libs/shared/store/src/index.ts'),
      '@mas/shared/theme':   resolve(__dirname, '../../libs/shared/theme/src/index.ts'),
      '@mas/shared/types':   resolve(__dirname, '../../libs/shared/types/src/index.ts'),
      '@mas/frontend-dal':   resolve(__dirname, '../../libs/shared/frontend-dal/src/index.ts'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'react-fundamentals',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
