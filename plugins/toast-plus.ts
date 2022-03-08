import { defineNuxtPlugin } from "#app";
import Toast from "@/components/toast";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast);
});
