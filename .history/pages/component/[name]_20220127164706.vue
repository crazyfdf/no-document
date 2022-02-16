<template>
  <component :is="componentSync" v-if="componentSync" />
  <DataTable :value="props" responsiveLayout="scroll">
    <Column field="name" header="Name"></Column>
    <Column field="description" header="Description"></Column>
    <Column field="default" header="Default"></Column>
    <Column field="controls" header="Controls"></Column>
  </DataTable>
</template>
<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
const route = useRoute();
const componentName = route.params.name;
const context = import.meta.globEager("../../src/components/**/index.vue");
console.log(context);

const componentSync = context[`../../src/components/${componentName}/index.vue`].default;

const { data } = await useFetch(
  `http://localhost:3000/api/componentPath?component=${componentName}`
);
const componentAST = data.value.componentsAST[0];
const { props, solts } = componentAST;
console.log(componentAST);

const products = ref();
</script>
<style scoped></style>
