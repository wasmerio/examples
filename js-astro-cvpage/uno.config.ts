import {
    defineConfig,
    presetIcons,
    presetUno,
    presetWebFonts,
    presetAttributify,
    presetTagify,
} from "unocss";
import transformerDirectives from '@unocss/transformer-directives'


export default defineConfig({
    shortcuts: {
        "flex-center": "flex items-center justify-center",
    },
    transformers: [transformerDirectives()],
    presets: [
        presetUno({
            dark: 'media'
        }),
        presetAttributify(),
        presetTagify(),
        presetIcons({
            cdn: "https://esm.sh/",
            extraProperties: {
                'display': 'inline-block',
                'height': '1.1em',
                'width': '1.1em',
                'vertical-align': 'text-bottom',
            },
        }),
        presetWebFonts({
            provider: "google",
            fonts: {
                sans: ["Inter:400,700", "Noto Sans SC:400,700"],
                serif: ["STIX Two Text:400,700", "Noto Serif SC:400,700"],
                mono: ["Fira Code:400,600", "Noto Sans SC:400,700"],
                display: ["Cinzel:400,600", "Noto Serif SC:400,700"],
            },
        }),
    ],
});