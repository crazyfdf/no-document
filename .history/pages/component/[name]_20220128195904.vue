<template>
  <div>
    <CodeView :path="componentName" :code="code"></CodeView>
    <DataTable :value="tableData" responsiveLayout="scroll">
      <Column field="name" header="Name"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="default" header="Default"></Column>
      <Column field="controls" header="Controls"></Column>
    </DataTable>
  </div>
</template>
<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import CodeView from "../../src/plugins/markdown-codeView/code-view";
const route = useRoute();
const componentName = route.params.name;

const { data } = await useFetch(`/api/componentPath?component=${componentName}`);
const componentAST = data.value.componentsAST[0];
const { props, solts } = componentAST;
console.log(componentAST);
const code = useState("code", () => {
  return `<y-${componentName}></y-${componentName}>`;
});
const tableData = props.map((item) => {
  return {
    name: item.name,
    type: item.type.name,
    description: item.description,
    default: item.defaultValue.value,
    controls: "",
  };
});
</script>
<style scoped></style>
