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
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  theme: {
    screens: {
      xs: '375px',
      ...defaultTheme.screens,
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
