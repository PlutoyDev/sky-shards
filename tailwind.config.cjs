/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const themeDef = {
  'base-100': colors.neutral[800],
  '--btn-text-case': 'full-width',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  theme: {
    screens: {
      'xs': '375px',
      ...defaultTheme.screens,
      'short': { raw: '(max-height: 474px)' },
      'tall': { raw: '(min-height: 475px)' },
      // Don't know why, but the "max" will be removed when "short" was added
      'max-xs': { max: '374px' },
      'max-sm': { max: '639px' },
      'max-md': { max: '767px' },
      'max-lg': { max: '1023px' },
    },
  },
  daisyui: {
    darkTheme: 'night',
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          ...themeDef,
          'primary': colors.sky[300],
          'primary-content': colors.black,
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          ...themeDef,
          'primary': colors.violet[600],
          'primary-content': colors.white,
        },
      },
    ],
  },
};
