import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { port: 5273, host: '127.0.0.1', open: false },
  preview: { port: 4273, host: '127.0.0.1', open: false },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    minify: false,
    rollupOptions: {
      input: {
        main: './index.html',
        laramie: './index-laramie.html'
      },
      output: {
        manualChunks: (id) => {
          // Put everything laramie-related in one chunk to avoid cross-chunk import conflicts
          if (id.includes('src/main-laramie.js') || 
              id.includes('src/geo/') ||
              id.includes('core/config/') ||
              id.includes('core/config.js')) {
            return 'laramie';
          }
          // Put node_modules in vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
