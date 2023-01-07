import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';

console.log('Version', process.env.VITE_VERSION_MINOR);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __NETLIFY_GIT_BRANCH__: `'${process.env.BRANCH}'`,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'backgrounds/*', 'icons/*'],
      manifest,
    }),
  ],
});
