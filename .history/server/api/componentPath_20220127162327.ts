import glob from "glob";
import { resolve } from "pathe";
import { parse } from "vue-docgen-api";
import { useBody, useCookies, useQuery } from "h3";
export default async (req, res) => {
  const { component } = await useQuery(req);

  const path = resolve("./src");
  const context = await glob.sync(`${path}/components/${component}/index.vue`);
  const componentsAST = await Promise.all(context.map(parse));
  return {
    context: context,
    componentsAST,
  };
};
