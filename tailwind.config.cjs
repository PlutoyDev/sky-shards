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
      'short': { raw: '(max-height: 475px)' },
      'tall': { raw: '(min-height: 475px)' },
      // Don't know why, but the "max" will be removed when "short" was added
      'max-xs': { max: '375px' },
      'max-sm': { max: '640px' },
      'max-md': { max: '768px' },
      'max-lg': { max: '1024px' },
      'max-xl': { max: '1280px' },
      'max-2xl': { max: '1536px' },
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
