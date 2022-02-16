<template>
  <component :is="component" v-if="component" />
</template>
<script lang="ts" setup>
const route = useRoute();
console.log(route.params.componentName);
const component = () =>
  useState("component", () =>
    defineAsyncComponent(() => import(`@/components/${route.params.componentName}/index.vue`))
  );
onMounted(() => {
  // component();
});
</script>
<style scoped></style>
