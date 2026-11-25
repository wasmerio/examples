// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from 'astro-icon';
import vercel from "@astrojs/vercel/static";
import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon({
      include: {
        mdi: ["*"],
        'ri': ['*'],
        'simple-icons': ['*'],
      }
    }),
    playformCompress({
      CSS: false,
      Image: false,
      Action: {
        Passed: async () => true,   // https://github.com/PlayForm/Compress/issues/376
      },
    })
  ],
  outDir: 'dist',
  output: 'static',
  adapter: vercel()
});
