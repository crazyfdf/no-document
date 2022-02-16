import glob from "glob";
import { resolve } from "pathe";
import { parse } from "vue-docgen-api";

export default async (req, res) => {
  const path = resolve("./src");
  const context = await glob.sync(`${path}/components/**/*.vue`);
  const componentsAST = await Promise.all(context.map(parse));
  return {
    context: context,
    componentsAST,
  };
};
