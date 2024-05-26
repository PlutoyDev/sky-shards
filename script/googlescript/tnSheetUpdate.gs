/// <reference path="../../node_modules/@types/google-apps-script/index.d.ts" />

const translationSheetId = '1rRi95qUiwhP5hskuAmdEanhVdng1lAeaOahf7FIdKpc';
const branch = 'v8';

const nsOrdering = [
  'application',
  'settings',
  'dateSelector',
  'footer',
  'durationUnits',
  'durationFmts',
  'skyRealms',
  'skyMaps',
  'shard',
  'shardCarousel',
  'override',
  'infoSection',
  'progressSection',
  'countdownSection',
  'infographicSection',
];

const dropNS = ['$schema', 'mapVariants'];

function updateList() {
  const tnBook = SpreadsheetApp.openById(translationSheetId);
  const tnSheet = tnBook.getSheetByName('Translation');
  const dataRange = tnSheet.getDataRange();
  const existingData = dataRange.getValues(); //Load all existing into memory
  // Row 1 is language codes
  // Row 2 is language names in English
  // Row 3 is language names in the language
  // Row 4 is last updated date time
  // Row 5 is blank

  // Column A is the key (namespace:phrase)
  // Column B is the English

  // Column C and row 6 onwards are translations

  // delete all rows after 5
  tnSheet.deleteRows(6, dataRange.getLastRow() - 5);
  const existingMap = new Map(existingData.slice(5).map(([key, en, ...translations]) => [key, translations]));

  const enStringsRes = UrlFetchApp.fetch(
    `https://raw.githubusercontent.com/PlutoyDev/sky-shards/${branch}/src/i18n/locales/en.json`,
  );
  if (enStringsRes.getResponseCode() > 400) {
    throw 'Unable to fetch English Strings';
  }

  const enStrings = JSON.parse(enStringsRes.getContentText());

  // Drop unwanted namespaces
  for (const ns of dropNS) {
    delete enStrings[ns];
  }

  // Sort the strings
  const sortedEnStrings = Object.entries(enStrings)
    .sort(([a], [b]) => nsOrdering.indexOf(a) - nsOrdering.indexOf(b))
    .flatMap(([ns, phrases]) => {
      return Object.entries(phrases)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([phrase, value]) => {
          return [`${ns}:${phrase}`, value];
        });
    });

  // Write row by row
  for (const [key, en] of sortedEnStrings) {
    const existingRow = existingMap.get(key);
    if (existingRow) {
      tnSheet.appendRow([key, en, ...existingRow]);
    } else {
      tnSheet.appendRow([key, en]);
    }
  }

  // Center align all translations and en cells
  const range = tnSheet.getRange(6, 2, tnSheet.getLastRow() - 5, tnSheet.getLastColumn() - 1);
  range.setHorizontalAlignment('center');
  // Resize columns to fit
  tnSheet.autoResizeColumns(1, tnSheet.getLastColumn());
}
