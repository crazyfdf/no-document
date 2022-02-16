<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const route = useRoute();
const componentSync = defineAsyncComponent(() => import(`@/components/spinner/index.vue`));
</script>
<style scoped></style>
