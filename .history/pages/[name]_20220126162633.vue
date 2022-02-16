<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const route = useRoute();
const componentSync = defineAsyncComponent(
  () => import(`@/components/${route.params.name}/index.vue`)
);
</script>
<style scoped></style>
