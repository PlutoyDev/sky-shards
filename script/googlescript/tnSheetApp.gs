/// <reference path="../../node_modules/@types/google-apps-script/index.d.ts" />

const translationSheetId = '16eSANTI310SY8uWjsjbxNBzyD-49hwF3OGYRkFPykoo';

/**
 *
 * @returns {[string, string][]}
 */
function getCodeLangsEntries(tnBook) {
  if (!tnBook) {
    tnBook = SpreadsheetApp.openById(translationSheetId);
  }
  tnSheet = tnBook.getSheetByName('Translation');
  const lastCol = tnSheet.getLastColumn();
  const translation = tnSheet.getRange(1, 1, 3, lastCol);
  const data = translation.getValues();

  const headers = data.map((row, i) => (i == 0 || i == 2 ? row.splice(2) : undefined));
  const languages = headers[0].map((code, i) => [code, headers[2][i]]);

  return languages;
}

/**
 *
 * @param {[string, string][]} codeLangEntries
 * @param {string | undefined} lang
 * @returns {Record<string, string | Record<string, string>>}
 */
function getTranslations(codeLangEntries, lang, tnBook) {
  if (!tnBook) {
    tnBook = SpreadsheetApp.openById(translationSheetId);
  }
  tnSheet = tnBook.getSheetByName('Translation');
  const lastRow = tnSheet.getLastRow();
  const lastCol = tnSheet.getLastColumn();
  const translation = tnSheet.getRange(6, 1, lastRow, lastCol);
  const data = translation.getValues();

  if (lang) {
    const index = codeLangEntries.findIndex(([code]) => code == lang);
    if (index == -1) return { error: 'Language not found' };

    const translations = {};
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      const phraseCode = data[i][0];
      const [ns, key] = phraseCode.split(':');
      const value = data[i][index + 2];
      if (!value) continue;
      if (!translations[ns]) translations[ns] = {};
      translations[ns][key] = value;
      count++;
    }

    if (count == 0) return { error: 'Empty' };
    return translations;
  }

  const translations = {};
  const tnKeyCount = {};

  for (let i = 0; i < data.length; i++) {
    const [phraseCode, _en, ...values] = data[i];
    const [ns, key] = phraseCode.split(':');

    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      if (!value) continue;
      const [langCode] = codeLangEntries[j];
      if (!translations[langCode]) {
        translations[langCode] = {};
        tnKeyCount[langCode] = 0;
      }
      if (!translations[langCode][ns]) translations[langCode][ns] = {};
      translations[langCode][ns][key] = value;
      tnKeyCount[langCode]++;
    }
  }

  const codeLangs = Object.entries(tnKeyCount).reduce((acc, [code, count]) => {
    if (count == 0) return acc;
    acc[code] = codeLangEntries.find(([c]) => c == code)[1];
    return acc;
  }, {});

  return { codeLangs, translations };
}

function generateHash(translations) {
  const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(translations));
  return hash
    .map(b => ('0' + (b & 0xff).toString(16)).slice(-2))
    .join('')
    .slice(0, 12);
}

function test() {
  const codeLangEntries = getCodeLangsEntries();
  const translations = getTranslations(codeLangEntries);
  if (translations.error) return console.log('Error', translations);
  const hash = generateHash(translations.translations);
  console.log(hash, translations);
}

function onEdit(e) {
  const range = e.range;
  console.log('Edited: ', range.getA1Notation());

  const tnBook = e.source;
  if (tnBook.getId() != translationSheetId) return console.log('Not translation sheet', tnBook.getId());

  const row = range.getRow();
  if (row < 6) return console.log('Not translation row');
  const col = range.getColumn();
  if (col < 3) return console.log('Not translation column');
  // Set 4th row to current date
  tnBook.getSheetByName('Translation').getRange(4, col).setValue(new Date().toISOString().slice(0, -5));
  // Calculate hash
  const codeLangEntries = getCodeLangsEntries(tnBook);
  const translations = getTranslations(codeLangEntries, undefined, tnBook);
  if (translations.error) return console.log('Error', translations);
  const hash = generateHash(translations.translations);
  tnBook.getRangeByName('CurrentVersionHash').setValue(hash);
  if (tnBook.getRangeByName('BuiltVersionHash').getValue() != hash) {
    const nextSaturday = new Date();
    nextSaturday.setDate(nextSaturday.getDate() + ((6 - nextSaturday.getDay()) % 7) + 1);
    nextSaturday.setHours(11, 0, 0, 0);
    tnBook.getRangeByName('NextBuildDate').setValue(nextSaturday.toISOString().slice(0, -5));
  } else {
    tnBook.getRangeByName('NextBuildDate').setValue('');
  }
}

/**
 * @typedef {Object} e
 * @property {string} queryString
 * @property {Record<str, str>} parameter
 * @property {Record<str, str[]>} parameter
 * @property {string} pathInfo
 */
function doGet(e) {
  const tnBook = SpreadsheetApp.openById(translationSheetId);
  const lang = e.parameter.lang;
  const buildMode = e.parameter.build;

  const entries = getCodeLangsEntries(tnBook);

  if (e.parameter.langCodeOnly == 'true') {
    const object = Object.fromEntries(entries);
    return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
  } else if (lang) {
    const translations = getTranslations(entries, lang);
    return ContentService.createTextOutput(JSON.stringify(translations)).setMimeType(ContentService.MimeType.JSON);
  } else {
    const translations = getTranslations(entries, undefined, tnBook);
    if (buildMode) {
      tnBook.getRangeByName('LastUpdateDate').setValue(new Date().toISOString().slice(0, -5));
      const currentHash = tnBook.getRangeByName('CurrentVersionHash').getValue();
      tnBook.getRangeByName('BuiltVersionHash').setValue(currentHash);
      const langFlagSheet = tnBook.getSheetByName('Language Flag');
      const langFlag = Object.fromEntries(langFlagSheet.getRange(1, 1, langFlagSheet.getLastRow(), 2).getValues());
      Object.keys(translations.codeLangs).forEach(k => {
        if (!(k in langFlag) || !langFlag[k]) {
          delete translations.codeLangs[k];
          delete translations.translations[k];
        }
      });
    }
    return ContentService.createTextOutput(JSON.stringify(translations)).setMimeType(ContentService.MimeType.JSON);
  }
}
