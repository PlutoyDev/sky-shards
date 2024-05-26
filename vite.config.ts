import react from '@vitejs/plugin-react-swc';
import { readFile, writeFile, readdir, unlink, stat } from 'fs/promises';
import { defineConfig, normalizePath } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';
import packageJson from './package.json';

process.env.VITE_VERSION = packageJson.version;
process.env.VITE_VERSION_MINOR = packageJson.version.split('.').slice(0, 2).join('.');
process.env.VITE_GIT_BRANCH = process.env.CF_PAGES_BRANCH;
process.env.VITE_GIT_COMMIT = process.env.CF_PAGES_COMMIT_SHA;

const isCfPages = process.env.CF_PAGES === '1';

console.log('Version', process.env.VITE_VERSION);
console.log('Branch', process.env.VITE_GIT_BRANCH);
console.log('Commit Ref', process.env.VITE_GIT_COMMIT);

const translationJsonUrl =
  'https://script.google.com/macros/s/AKfycbw3r2wYz_qnUf0shFqoZFTc5z6uQ1DNOdS54ZZ0vrfmcOl-OLKe-NW7GItLcLuNexr7/exec';
const translationDir = normalizePath('./src/i18n');

process.env.VITE_GS_TRANSLATION_URL = translationJsonUrl;

if (process.env.VITE_SHARD_REMOTE_URL === undefined) {
  process.env.VITE_SHARD_REMOTE_URL = 'https://sky-shardfig.plutoy.top';
}

// check public/_header csp allow translation url and dynamic data url
readFile('./public/_headers', 'utf-8').then(headers => {
  if (!headers.includes(translationJsonUrl)) {
    console.error('Translation url not allowed in public/_headers');
    process.exit(1);
  }
  if (!headers.includes(process.env.VITE_SHARD_REMOTE_URL)) {
    console.error('Dynamic data url not allowed in public/_headers');
    process.exit(1);
  }
});

// Check if the translation file (locales.json) exists
try { 
  stat(normalizePath('./src/i18n/locales.json'))
} catch (e) {
  console.error('locales.json not found, run pnpm downloadTrans to download it');
  process.exit(1);
}
  
// https://vitejs.dev/config/
export default defineConfig({
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
  ],
});
