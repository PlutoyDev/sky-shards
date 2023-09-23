import react from '@vitejs/plugin-react-swc';
import { writeFile, readdir, unlink } from 'fs/promises';
import fetch from 'node-fetch';
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
  'https://script.google.com/macros/s/AKfycbyUbkKZUPSQAqU5XiVOEpyCFRFP2BvFvmwB9UDyvEdoH3Q7mvf-oIbFq7X6o5D6_Jgm/exec';
const translationDir = normalizePath('./src/i18n');

process.env.VITE_GS_TRANSLATION_URL = translationJsonUrl;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'translation',
      async buildStart() {
        console.log('Fetching translation data...');
        const [json, localLocales] = await Promise.all([
          fetch(translationJsonUrl).then(res => res.json()),
          readdir(translationDir + '/locales').then(files =>
            files.filter(file => file.endsWith('.json') && file !== 'en.json').map(file => file.slice(0, -5)),
          ),
        ]);
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
      workbox,
    }),
  ],
});
