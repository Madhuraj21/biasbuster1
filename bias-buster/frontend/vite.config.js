import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'public', // Specify the public directory as the root
  plugins: [react()],
  server: {
    port: 5173,
  },
});
