import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use relative base path to ensure assets load correctly on GitHub Pages
  base: './',
  define: {
    // This allows process.env.API_KEY to work in the browser build.
    // If API_KEY is not available during build (e.g. GitHub Actions without secret), it defaults to empty.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});