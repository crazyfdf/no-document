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
      <Column header="Controls">
        <template #body="{ data }">
          <FormType
            :type="data.type"
            :value="data.default"
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
console.log(componentAST);

const { props, solts, displayName, description } = componentAST;
const tableData = props.map((item) => {
  let defaultValue =
    item.type.name === "string" ? JSON.parse(item.defaultValue.value) : item.defaultValue.value;
  console.log(defaultValue);
  if (!defaultValue) {
    defaultValue = "-";
  }

  return {
    name: item.name,
    type: item.type.name,
    description: item.description,
    default: defaultValue,
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
  const _componentData = componentData.value;
  if (data.default === value) {
    delete _componentData[data.name];
  } else {
    _componentData[data.name] = value;
  }

  componentData.value = _componentData;
}
</script>
<style scoped>
.y-body {
  padding: 1rem;
}
.y-table {
  margin-top: 2rem;
}
</style>
