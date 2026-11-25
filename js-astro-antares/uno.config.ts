import type { Theme } from 'unocss/preset-uno'
import { presetUno, type PresetOrFactoryAwaitable } from 'unocss'
import presetTheme from 'unocss-preset-theme'
import { defineConfig } from 'unocss'

export const lightTheme = {
  colors: {
    global: '#f0f2f4',
    normal: '#ffffff',
    textPrim: '#4c4948',
    textDesc: '#858585',
    linePrim: '#ccc',
    gradientBlue: {
      left: '#0ed2f7',
      middle: '#1E8CD9',
      right: '#024bc0',
    },
    mask: 'rgba(255, 255, 255, 0.6)'
  },
} satisfies Theme

export const darkTheme = {
  colors: {
    global: '#191919',
    normal: '#1e1e1f',
    textPrim: '#c9c9d7',
    textDesc: '#777777',
    linePrim: '#404040',
    mask: 'rgba(0, 0, 0, 0.6)'
  }
} satisfies Theme

export default defineConfig({
  theme: {
    ...lightTheme,
    animation: {
      keyframes: {
        'move-up': `{0% {transform:translateY(40px);opacity:0} 100% {transform: translateY(0);opacity:1}}`,
        'move-up-sm': `{0% {transform:translateY(20px);opacity:0} 100% {transform: translateY(0);opacity:1}}`,
      },
      durations: {
        'move-up': `0.3s`,
        'move-up-sm': `0.2s`,
      },
    },
  },
  presets: [
    presetUno(),
    presetTheme<Theme>({ theme: { dark: darkTheme} }) as PresetOrFactoryAwaitable<Theme>
  ],
  rules: [
    [/^bgi-\[([\w\W]+)\]$/, ([, value]) => (
      { 'background-image': `${value}` }
    )],
  ],
  shortcuts: {
    'full': 'w-full h-full',
    'card': 'bg-normal rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-500',
    'gc-text': 'inline-block font-bold text-transparent bg-clip-text bgi-[var(--gc-text-bgimg)] dark:bgi-[var(--gc-text-bgimg-dark)]',
    'btn-sm': 'inline-block text-xs lh-[1.2] p0.8 px3 bg-#eee hover:bg-gray-2 active:bg-gray-3 dark:bg-#303136 dark:hover:bg-dark-1 dark:active:bg-dark-2 rounded-full',
    'btn-num' : 'bg-normal px.5em min-w2em h2em inline-flex justify-center items-center rounded-md shadow-md',
  },
})
