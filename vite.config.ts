import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repository from /-graceon-tahiti-redesign/.
export default defineConfig({
  base: '/-graceon-tahiti-redesign/',
  plugins: [react()],
});