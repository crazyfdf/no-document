const context = import.meta.globEager("./src/components/**/index.vue");

export default async (req, res) => {
  return {
    someData: context,
  };
};
