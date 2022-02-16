import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  nuxtApp.vueApp.use(PrimeVue);
});
