import glob from "glob";
import { resolve } from "pathe";
import { parse } from "vue-docgen-api";

export default async (req, res) => {
  const path = resolve("./src");
  const context = await glob.sync(`${path}/components/**/*.vue`);
  context.map(async (item) => {
    const ast = await parse(item);
    console.log(ast);
  });
  return {
    context: context,
  };
};
