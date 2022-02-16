<template>
  <component :is="component" v-if="component" />
</template>
<script lang="ts" setup>
const componentName = useRoute().params.name;
console.log(componentName);
const component = () =>
  useState("component", () =>
    defineAsyncComponent(() => import(`@/components/${componentName}/index.vue`))
  );
onMounted(() => {
  // component();
});
</script>
<style scoped></style>
