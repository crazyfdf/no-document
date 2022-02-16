import glob from "glob";
import { resolve } from "pathe";

export default async (req, res) => {
  const path = resolve(__dirname, "./src");
  const context = await glob.sync(`${path}/components/**/*.vue`);
  console.log(context);

  return {
    someData: true,
    context: context,
  };
};
