<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const route = useRoute();
const componentName = route.params.name;
const context = import.meta.globEager("../../src/components/**/index.vue");
console.log(context);

const componentSync = context[`./../src/components/${componentName}/index.vue`].default;
const { data } = await useFetch(
  `http://localhost:3000/api/componentPath?component=${componentName}`
);
const componentAST = data.value.componentsAST[0];
console.log(componentAST);
</script>
<style scoped></style>
