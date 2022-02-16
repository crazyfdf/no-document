<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const context = import.meta.globEager("../src/components/**/index.vue");
console.log(context);

const route = useRoute();
const path = `@/components/${route.params.name}/index.vue`;
console.log(path);
const componentSync = context[0];
const { data } = await useFetch(
  `http://localhost:3000/api/componentPath?component=${route.params.name}`
);
const componentAST = data.value.componentsAST[0];
console.log(componentAST);
</script>
<style scoped></style>
