import node from '@astrojs/node';
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from 'astro/config';


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), compress()],
  output: "server",
  adapter: node({ mode: 'standalone' })});