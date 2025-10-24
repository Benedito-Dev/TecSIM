/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Processa todos os arquivos JS/JSX/TS/TSX na pasta src
    "./public/index.html", // Processa o arquivo HTML principal
  ],
  theme: {
    extend: {
      scale: {
        '200': '2', // Adiciona uma escala personalizada de 2x
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
};