<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const route = useRoute();
console.log(route.params.name);
const path = `@/components/${route.params.name}/index.vue`;
const componentSync = defineAsyncComponent(() => import(path));
</script>
<style scoped></style>
