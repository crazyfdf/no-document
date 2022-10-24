import { defineNuxtConfig } from "nuxt3";
import { resolve } from "pathe";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: ["@nuxtjs/tailwindcss"],
  alias: {
    "@": resolve(__dirname, "./src"),
  },
  css: [
    "element-plus/dist/index.css",
    "primevue/resources/themes/saga-blue/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
  ],
});
