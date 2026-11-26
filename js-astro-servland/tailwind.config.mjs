/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0047AB',
        'dark': {
          'bg': '#1a1a1a',
          'card': '#2a2a2a',
          'text': '#e5e5e5'
        }
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #0047AB 0%, #00A3FF 50%, #2563eb 100%)',
        'gradient-dark': 'linear-gradient(135deg, #020617 0%, #1e3a8a 50%, #1e40af 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient-flow': 'gradientFlow 6s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradientFlow: {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 50%'
          },
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
