<template>
  <component :is="component" v-if="component" />
</template>
<script lang="ts" setup>
console.log(useRoute().params.name);
const component = defineAsyncComponent(
  () => import(`@/components/${useRoute().params.name}/index.vue`)
);
</script>
<style scoped></style>
