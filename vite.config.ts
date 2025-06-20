//import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
//export default defineConfig({
  //plugins: [react()],
  //optimizeDeps: {
   // exclude: ['lucide-react'],
  //},
//});

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/kitchen/', // IMPORTANT: use your repo name here
});
