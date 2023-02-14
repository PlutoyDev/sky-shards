import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';
import workbox from './workbox';

console.log('Version', process.env.VITE_VERSION_MINOR);
console.log('Branch', process.env.BRANCH);
console.log('Commit Ref', process.env.COMMIT_REF);
console.log('Netlify CDN', process.env.NETLIFY_IMAGES_CDN_DOMAIN);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __NETLIFY_GIT_BRANCH__: `'${process.env.BRANCH}'`,
    __NETLIFY_GIT_COMMIT_REF__: `'${process.env.COMMIT_REF}'`,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.txt', 'backgrounds/*', 'icons/*'],
      manifest,
      workbox,
    }),
  ],
});
