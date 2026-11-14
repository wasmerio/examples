// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  vue: {
    compilerOptions: { isCustomElement: (tag) => tag.startsWith("wasmer-") },
  },
  css: ["~/assets/starter.css"],
  app: {
    head: {
      title: "Nuxt on Wasmer Edge",
      meta: [{ name: "description", content: "A Nuxt starter, generated to static files and served from Wasmer Edge" }],
      script: [{ type: "module", src: "/starter-ui.js" }],
    },
  },
});
