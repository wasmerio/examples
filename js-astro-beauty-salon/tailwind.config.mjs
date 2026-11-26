/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Configuramos las fuentes que instalamos
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        // Paleta Glam Oficial
        glam: {
          dark: '#221f27', // Negro suave / Neutro sofisticado
          navy: '#253144', // Azul marino (Textos destacados)
          gray: '#414957', // Gris plomo
          taupe: '#89696b', // Marrón grisáceo
          silver: '#ccc9ce', // Gris claro
        },
        pink: {
          100: '#f8e4dd', // Base clara
          200: '#f4dddd',
          300: '#edc6b6', // Rosado piel
          400: '#e4afa2',
          500: '#d4aaad', // Rosado elegante (Principal)
        },
        water: {
          100: '#c8dbe3', // Azul agua claro
          200: '#97bbc9',
          300: '#74aac4',
          400: '#618193', // Azul acero
          500: '#2a5870', // Azul petróleo
        },
        pastel: {
          cream: '#fcf4ec',
          mint: '#f6fbfc',
          sand: '#faecdc',
          earth: '#a07c6b', // Toque tierra
        },
      },
    },
  },
  plugins: [typography],
};
