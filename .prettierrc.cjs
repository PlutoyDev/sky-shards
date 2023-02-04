/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'avoid',
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  quoteProps: 'consistent',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '^[./](?!.*\\.(css|scss|less|styl|png|jpg|jpeg|gif|svg|ttf|woff|woff2|eot|otf)$)',
    '^[./]',
  ],
  importOrderSort: 'asc',
};
