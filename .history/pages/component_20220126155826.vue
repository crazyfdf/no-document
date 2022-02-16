<template>
  <component :is="component" />
</template>
<script lang="ts" setup>
const component = defineAsyncComponent(() => import("@/components/spinner/index.vue"));
</script>
<style scoped></style>
