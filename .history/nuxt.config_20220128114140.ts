import { defineNuxtConfig } from "nuxt3";
import { resolve } from "pathe";
const context = import.meta.globEager("../../src/components/**/index.vue");

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  app: {
    context,
  },
  alias: {
    "@": resolve(__dirname, "./src"),
  },
});
