import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';
import workbox from './workbox';

console.log('Version', process.env.VITE_VERSION_MINOR);
console.log('Branch', process.env.CF_PAGES_BRANCH);
console.log('Commit Ref', process.env.CF_PAGES_COMMIT_SHA);

process.env.VITE_GIT_BRANCH = process.env.CF_PAGES_BRANCH;
process.env.VITE_GIT_COMMIT = process.env.CF_PAGES_COMMIT_SHA;

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
      workbox,
    }),
  ],
});
