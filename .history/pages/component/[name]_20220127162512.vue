<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const context = import.meta.globEager("../src/components/**/index.vue");
console.log(context);

import Spinner from "~~/src/components/spinner/index.vue";
const route = useRoute();
const path = `@/components/${route.params.name}/index.vue`;
console.log(path);
const componentSync = defineAsyncComponent({
  loader: () => import("@/components/spinner/index.vue"),
  loadingComponent: Spinner,
  delay: 2000, //在显示loadingComponent组件之前, 等待多长时间
  onError: function (err, retry, attempts) {
    console.log(err);
  },
});
const data = await useFetch(
  `http://localhost:3000/api/componentPath?component=${route.params.name}`
);
const componentAST = data.value.componentsAST[0];
console.log(componentAST);
</script>
<style scoped></style>
