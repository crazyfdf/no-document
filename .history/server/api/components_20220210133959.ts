import glob from "glob";
import { resolve } from "pathe";
import { parse } from "vue-docgen-api";
export default async (req, res) => {
  const path = resolve("./src");
  const components = await glob.sync(`${path}/components/**/index.vue`);
  const componentsAST = await Promise.all(components.map(parse));
  let componentsResult = [];
  for (let i = 0; i < components.length; i++) {
    componentsResult.push({
      path: components[i].split("/").reverse()[1],
      value: componentsAST[i].displayName,
    });
  }

  return {
    components: componentsResult,
  };
};
