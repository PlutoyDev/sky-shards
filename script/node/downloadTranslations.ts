// Run with `ts-node script/node/downloadTrans.ts`
import { readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';

const isCfPages = process.env.CF_PAGES === '1';

const translationJsonUrl =
  'https://script.google.com/macros/s/AKfycbxWmAhleoWLtyVpXgICkkGUdAZKi_JPkuSxJ243H33316scaRFgY0kEq6UR3iPajsq4/exec';
const translationDir = path.resolve('./src/i18n');

await fetch(translationJsonUrl + (isCfPages ? '?build=true' : ''))
  .then(r => r.text())
  .then(text => writeFile(path.join(translationDir, 'locales.json'), text));
