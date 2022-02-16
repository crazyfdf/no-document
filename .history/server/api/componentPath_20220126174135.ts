const glob = require("glob");
export default async (req, res) => {
  const context = await glob("../../src/components/**/index.vue");
  console.log(context);

  return {
    someData: true,
    context: context,
  };
};
