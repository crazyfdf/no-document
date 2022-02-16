<template>
  <component :is="componentSync" v-if="componentSync" />
</template>
<script lang="ts" setup>
import Spinner from "~~/src/components/spinner/index.vue";

const route = useRoute();
console.log(route.params.name);
const path = `@/components/${route.params.name}/index.vue`;
console.log(path);

const componentSync = defineAsyncComponent({
  loader: () => import("@/components/spinner/index.vue"),
  loadingComponent: Spinner,
  delay: 2000, //在显示loadingComponent组件之前, 等待多长时间
  onError: function (err, retry, attempts) {
    console.log(err);
  },
});
</script>
<style scoped></style>
