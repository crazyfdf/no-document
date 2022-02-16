<template>
  <component :is="component" />
</template>
<script lang="ts" setup>
console.log(useRoute().params.name);

const component = defineAsyncComponent(() => import("@/src/components/spinner/index.vue"));
</script>
<style scoped></style>
