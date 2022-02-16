import glob from "glob";
export default async (req, res) => {
  const context = await glob.sync("*.vue");
  console.log(context);

  return {
    someData: true,
    context: context,
  };
};
