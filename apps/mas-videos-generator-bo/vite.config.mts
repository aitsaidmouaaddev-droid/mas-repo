import { defineConfig, createLogger } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const logger = createLogger();
const originalError = logger.error.bind(logger);
logger.error = (msg, opts) => {
  if (msg.includes('ECONNREFUSED') || msg.includes('http proxy error')) return;
  originalError(msg, opts);
};

export default defineConfig(() => ({
  customLogger: logger,
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/mas-videos-generator-bo',
  server: {
    port: 5555,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:4444',
        changeOrigin: true,
        onError: (_err, _req, res) => { res.end(); },
      },
      '/graphql': {
        target: 'http://localhost:4444',
        changeOrigin: true,
        onError: (_err, _req, res) => { res.end(); },
      },
    },
  },
  preview: {
    port: 5555,
    host: 'localhost',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@mas/react-ui': resolve(__dirname, '../../libs/react/ui/src/index.ts'),
      '@mas/shared/store': resolve(__dirname, '../../libs/shared/store/src/index.ts'),
      '@mas/shared/theme': resolve(__dirname, '../../libs/shared/theme/src/index.ts'),
      '@mas/shared/types': resolve(__dirname, '../../libs/shared/types/src/index.ts'),
      '@mas/shared/i18n': resolve(__dirname, '../../libs/shared/i18n/src/index.ts'),
      '@mas/front-auth': resolve(__dirname, '../../libs/react/front-auth/src/index.ts'),
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
