<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
import Spinner from "~~/src/components/spinner/index.vue";
const route = useRoute();
console.log(route.params.name);
const path = `@/components/${route.params.name}/index.vue`;
console.log(path);

const componentSync = defineAsyncComponent({
  loader: () => import(path),
  loadingComponent: Spinner,
});
</script>
<style scoped></style>
