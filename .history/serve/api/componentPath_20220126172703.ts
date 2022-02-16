const context = import.meta.globEager("../../src/components/**/index.vue");

export default async (req, res) => {
  console.log(context);

  return {
    someData: context,
  };
};
