import react from '@vitejs/plugin-react-swc';
import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import fetch from 'node-fetch';
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

// check public/_header csp allow translation url
readFile('./public/_headers', 'utf-8').then(headers => {
  if (!headers.includes(translationJsonUrl)) {
    console.error('Translation url not allowed in public/_headers');
    process.exit(1);
  }
});

const trnaslationPr = Promise.all([
  fetch(translationJsonUrl + (isCfPages ? '?build=true' : '')).then(res => res.json()),
  readdir(translationDir + '/locales').then(files =>
    files.filter(file => file.endsWith('.json') && file !== 'en.json').map(file => file.slice(0, -5)),
  ),
]).then(async ([json, localLocales]) => {
  const { codeLangs, translations } = json as any;
  codeLangs['en'] = 'English';
  const languageCodeFilename = translationDir + '/codeLangs.json';
  const writePromises = [
    writeFile(languageCodeFilename, JSON.stringify(codeLangs, null, 2)),
    ...Object.entries(translations).map(
      ([lang, translation]) => (
        console.log('\tWriting', lang),
        writeFile(translationDir + '/locales/' + lang + '.json', JSON.stringify(translation, null, 2))
      ),
    ),
    ...localLocales.map(l =>
      l in translations
        ? Promise.resolve()
        : (console.log('\tDeleting', l), unlink(translationDir + '/locales/' + l + '.json')),
    ),
  ];
  await Promise.all(writePromises);
  return codeLangs as Record<string, string>;
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'translation',
      async buildStart() {
        await trnaslationPr;
      },
      async transformIndexHtml(html) {
        const codeLangs = await trnaslationPr;

        // Find the end of the title tag
        const titleEnd = html.indexOf('</title>') + 8;
        // Inject localized alternate links
        const links = Object.keys(codeLangs)
          .map(code => `    <link rel="alternate" hreflang="${code}" href="/${code}" />`)
          .join('\n');

        return html.slice(0, titleEnd) + '\n\n    <!-- Localization -->\n' + links + '\n' + html.slice(titleEnd);
      },
    },
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
