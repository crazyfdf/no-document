import glob from "glob";
import { parse } from "vue-docgen-api";
import { resolve } from "pathe";
export default async (req, res) => {
  const path = resolve("./src");
  const components = await glob.sync(`${path}/components/**/index.vue`);
  const componentsAST = await Promise.all(components.map(parse));
  return {
    componentsAST,
  };
};
