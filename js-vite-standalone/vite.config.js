import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        about: path.resolve(rootDir, 'about.html'),
        main: path.resolve(rootDir, 'index.html'),
      },
    },
  },
});
