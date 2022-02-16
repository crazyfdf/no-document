import antdv from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(antdv);
});
