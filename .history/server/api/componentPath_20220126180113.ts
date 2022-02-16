import glob from "glob";
import { resolve } from "pathe";

export default async (req, res) => {
  const path = resolve("./src");
  const context = await glob.sync(`${path}/components/**/*.vue`);

  return {
    context: context,
  };
};
