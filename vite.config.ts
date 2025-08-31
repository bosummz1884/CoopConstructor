import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      // Explicitly tell tsconfig-paths to use the root tsconfig.json
      projects: [resolve(__dirname, 'tsconfig.json')],
    }),
  ],
  server: {
    port: 3000,
    // Vite's error overlay is enabled by default in development
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      },
      {
        find: '@shared',
        replacement: resolve(__dirname, 'shared')
      },
      {
        find: '@components',
        replacement: resolve(__dirname, './src/components')
      },
      {
        find: '@lib',
        replacement: resolve(__dirname, './src/lib')
      },
      {
        find: '@contexts',
        replacement: resolve(__dirname, './src/contexts')
      },
      {
        find: '@assets',
        replacement: resolve(__dirname, '../attached_assets')
      },
    ]
  },
  root: resolve(__dirname, "."),
  build: {
    outDir: resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  define: {
    'process.env': {},
  },
});
