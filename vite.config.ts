import react from '@vitejs/plugin-react-swc';
import { writeFile } from 'fs/promises';
import { defineConfig, normalizePath } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest';
import packageJson from './package.json';
import workbox from './workbox';

process.env.VITE_VERSION = packageJson.version;
process.env.VITE_VERSION_MINOR = packageJson.version.split('.').slice(0, 2).join('.');
process.env.VITE_GIT_BRANCH = process.env.CF_PAGES_BRANCH;
process.env.VITE_GIT_COMMIT = process.env.CF_PAGES_COMMIT_SHA;

console.log('Version', process.env.VITE_VERSION);
console.log('Branch', process.env.VITE_GIT_BRANCH);
console.log('Commit Ref', process.env.VITE_GIT_COMMIT);

const translationJsonUrl =
  'https://script.google.com/macros/s/AKfycbwADUiztSSF89E92fOvZgMdTUFCOkCWhYilwrbC4Qf-d0Oqd9EsHmN8HIl8creFfO4/exec';
const translationDir = normalizePath('./src/i18n');

fetch(translationJsonUrl)
  .then(res => res.json())
  .then(json => {
    const { codeLangs, translations } = json;
    codeLangs['en'] = 'English';
    const languageCodeFilename = translationDir + '/codeLangs.json';
    const writePromises = [
      writeFile(languageCodeFilename, JSON.stringify(codeLangs, null, 2)),
      ...Object.entries(translations).map(([lang, translation]) =>
        writeFile(translationDir + '/locales/' + lang + '.json', JSON.stringify(translation, null, 2)),
      ),
    ];
    return Promise.all(writePromises);
  });

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
