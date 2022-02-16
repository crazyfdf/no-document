<template>
  <component :is="component" v-if="component" />
</template>
<script lang="ts" setup>
const componentName = useRoute().params.name;
console.log(componentName);
const component = useState("component");
onMounted(() => {
  component.value = defineAsyncComponent(() => import(`@/components/${componentName}/index.vue`));
});
</script>
<style scoped></style>
