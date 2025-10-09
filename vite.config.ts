import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// http://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tsconfigPaths(), // tsconfig.json의 paths를 Vite가 자동 인식
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
  define: {
    // Next.js 환경변수 호환성을 위해
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
    // sockjs-client를 위한 global 폴리필
    global: 'globalThis',
  },
});
