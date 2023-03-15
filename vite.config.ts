import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';
import workbox from './workbox';

console.log('Version', process.env.VITE_VERSION_MINOR);
console.log('Branch', process.env.CF_PAGES_BRANCH);
console.log('Commit Ref', process.env.CF_PAGES_COMMIT_SHA);
console.log('Netlify CDN', process.env.NETLIFY_IMAGES_CDN_DOMAIN);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __NETLIFY_GIT_BRANCH__: `'${process.env.CF_PAGES_BRANCH}'`,
    __NETLIFY_GIT_COMMIT_REF__: `'${process.env.CF_PAGES_COMMIT_SHA}'`,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'fonts/*', 'backgrounds/*', 'icons/*', 'infographics/**/*.webp', 'emojis/*.webp'],
      manifest,
      workbox,
    }),
  ],
});
