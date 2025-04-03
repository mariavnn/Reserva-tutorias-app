/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "var(--color-background)",
          dark: "var(--color-background)",
        },
        border: {
          light: "var(--color-border)",
          dark: "var(--color-border)",
        },
        primary: {
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          light: "var(--color-secondary-light)",
          dark: "var(--color-secondary-dark)",
        },
        tertiary: {
          light: "var(--color-tertiary-light)",
          dark: "var(--color-tertiary-dark)",
        },
        text: {
          "light-primary": "var(--color-text-primary)",
          "light-secondary": "var(--color-text-secondary)",
          "light-tertiary": "var(--color-text-terciary)",
          "dark-primary": "var(--color-text-primary)",
          "dark-secondary": "var(--color-text-secondary)",
          "dark-tertiary": "var(--color-text-terciary)",
        },
      },
    },
  },
  plugins: [],
}
