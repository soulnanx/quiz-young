import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Quiz de Young',
        short_name: 'QuizYoung',
        description: 'Questionário de Esquemas de Young (YSQ-S3)',
        lang: 'pt-BR',
        start_url: '/quiz-young/',
        scope: '/quiz-young/',
        display: 'standalone',
        theme_color: '#1e40af',
        background_color: '#f9fafb',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/quiz-young/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
  base: '/quiz-young/',
});
