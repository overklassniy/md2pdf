import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-image.svg', 'static/og-img.png'],
      workbox: {
        // woff2 covers the KaTeX fonts: precaching them keeps math
        // rendering offline and lets exportHtml() fetch them for data-URI
        // embedding even without a network.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'md2pdf – Markdown to PDF',
        short_name: 'md2pdf',
        description:
          'Offline Markdown to PDF: edit, preview and print to PDF in the browser',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
