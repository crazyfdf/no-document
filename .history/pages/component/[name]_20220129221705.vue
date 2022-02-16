<template>
  <div class="y-body">
    <CodeView :path="componentName" :code="code" :title="displayName" v-bind="componentData">{{
      description
    }}</CodeView>

    <DataTable class="y-table" :value="tableData" responsiveLayout="scroll">
      <Column field="name" header="Name"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="default" header="Default"></Column>
      <Column field="value" header="Controls">
        <template #body="{ data }">
          <FormType
            :type="data.type"
            :value="data.value"
            @change="onChange(data, $event)"
          ></FormType>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import CodeView from "@/plugins/markdown-codeView/code-view/index.vue";
import FormType from "@/plugins/markdown-codeView/form-type/index.vue";
const route = useRoute();
const componentName = route.params.name as string;

const { data } = await useFetch(`/api/componentPath?component=${componentName}`);
const componentAST = data.value.componentsAST[0];
const { props, solts, displayName, description } = componentAST;
console.log(componentAST);
const tableData = props.map((item) => {
  return {
    name: item.name,
    type: item.type.name,
    description: item.description,
    default: item.defaultValue.value,
    value: "",
  };
});
const componentData = ref({});
const code = computed(() => {
  let _code = `<${componentName}`;
  Object.entries(componentData.value).map(([key, value]) => {
    _code += ` ${key}="${value}"`;
  });
  _code += `></${componentName}>`;

  return encodeURIComponent(_code);
});
function onChange(data, value) {
  if (data.default === value) {
    Reflect.deleteProperty(componentData.value, data.name);
  } else {
    componentData.value[data.name] = value;
  }
}
</script>
<style scoped>
.y-body {
  padding: 1rem;
}
.y-table {
  margin-top: 1rem;
}
</style>
