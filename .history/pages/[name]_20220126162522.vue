<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
const route = useRoute();
console.log(route.params.name);
const componentSync = useState("componentSync");
onMounted(() => {
  componentSync.value = defineAsyncComponent(
    () => import(`@/components/${route.params.name}/index.vue`)
  );
});
</script>
<style scoped></style>
