import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: false,
    hmr: {
      port: 3001,
      host: '0.0.0.0'
    },
    proxy: {
      '/admin-api': {
        target: 'http://0.0.0.0:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin-api/, '/api')
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});