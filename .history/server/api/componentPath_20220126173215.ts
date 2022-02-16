const context = import.meta.glob("../../src/components/**/index.vue");

export default async (req, res) => {
  console.log(context);

  return {
    someData: true,
    context: context,
  };
};
