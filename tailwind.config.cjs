const colors = require('tailwindcss/colors')

const themeDef = {
  "base-100": colors.neutral[800],
  "--btn-text-case": "full-width",
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    darkTheme: "night",
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          ...themeDef,
          "primary": colors.sky[300],
          "primary-content": colors.black,
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          ...themeDef,
          "primary": colors.violet[600],
          "primary-content": colors.white,
        }
      },
    ],
  }
};
