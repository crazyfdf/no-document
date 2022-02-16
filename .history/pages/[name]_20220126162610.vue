<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const route = useRoute();
console.log(route.params.name);
const componentSync = defineAsyncComponent(
  () => import(`@/components/${route.params.name}/index.vue`)
);
onMounted(() => {
  // component();
});
</script>
<style scoped></style>
