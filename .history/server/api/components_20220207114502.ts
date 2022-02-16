import glob from "glob";
import { resolve } from "pathe";
export default async (req, res) => {
  const path = resolve("./src");
  const components = await glob.sync(`${path}/components/**/index.vue`);
  return {
    components,
  };
};
