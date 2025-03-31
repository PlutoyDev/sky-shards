import react from '@vitejs/plugin-react-swc';
import { readFile, stat } from 'fs/promises';
import { defineConfig, normalizePath } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';
import packageJson from './package.json';

process.env.VITE_VERSION = packageJson.version;
process.env.VITE_VERSION_MINOR = packageJson.version.split('.').slice(0, 2).join('.');
process.env.VITE_GIT_BRANCH = process.env.CF_PAGES_BRANCH;
process.env.VITE_GIT_COMMIT = process.env.CF_PAGES_COMMIT_SHA;

console.log('Version', process.env.VITE_VERSION);
console.log('Branch', process.env.VITE_GIT_BRANCH);
console.log('Commit Ref', process.env.VITE_GIT_COMMIT);

const translationJsonUrl =
  'https://script.google.com/macros/s/AKfycbxWmAhleoWLtyVpXgICkkGUdAZKi_JPkuSxJ243H33316scaRFgY0kEq6UR3iPajsq4/exec';

process.env.VITE_GS_TRANSLATION_URL = translationJsonUrl;

if (!process.env.VITE_SHARD_REMOTE_URL) {
  process.env.VITE_SHARD_REMOTE_URL = 'https://sky-shardfig.plutoy.top';
}

// Check if the translation file (locales.json) exists
try {
  stat(normalizePath('./src/i18n/locales.json'));
} catch (e) {
  console.error('locales.json not found, run pnpm downloadTrans to download it');
  process.exit(1);
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          'i18n': ['i18next', 'react-i18next', './src/i18n/index.tsx'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'fonts/*',
        'backgrounds/*',
        'icons/*',
        'infographics/**/*.webp',
        'emojis/*.webp',
        'ext/*',
      ],
      manifest,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cloudflare-insights',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
    {
      name: 'edit_headers',
      async buildEnd() {
        const additionalConnectSrc = [
          'https://script.googleusercontent.com/macros/echo',
          process.env.VITE_GS_TRANSLATION_URL,
          process.env.VITE_SHARD_REMOTE_URL,
        ].join(' ');
        const premadeHeaders = await readFile('./src/_headers', 'utf-8');
        const headers = premadeHeaders.replace('${addConnectSrc}', additionalConnectSrc);
        this.emitFile({ type: 'asset', fileName: '_headers', source: headers });
        console.log('dis/allowed connect-src:', additionalConnectSrc);
      },
    },
  ],
});
