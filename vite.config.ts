import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, '.') },
        { find: /^formdata-polyfill(\/.*)?$/, replacement: path.resolve(__dirname, 'src/empty.ts') },
        { find: /^node-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'src/empty.ts') },
        { find: /^whatwg-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'src/empty.ts') },
        { find: /^cross-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'src/empty.ts') },
      ],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
