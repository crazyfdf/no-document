<template>
  <component :is="component" />
</template>
<script lang="ts" setup>
const component = defineAsyncComponent(
  () => import(`@/components/${useRoute().params.name}/index.vue`)
);
</script>
<style scoped></style>
