/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        firaCode: ["'Fira Code', monospace"],
      },
      screens: {
        lowest: "280px",
        mobile: "400px",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin"), require("flowbite/plugin")],
};
