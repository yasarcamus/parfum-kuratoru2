import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Root directory is the current directory
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
