<template>
  <div class="y-body">
    <CodeView
      :path="componentName"
      :code="code"
      :title="displayName"
      :componentProps="componentProps"
      >{{ description }}
    </CodeView>

    <DataTable class="y-props" :value="propsData" responsiveLayout="scroll">
      <template #header>
        <h2 class="m-0">Props</h2>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="description" header="Description"></Column>
      <Column header="Default">
        <template #body="{ data }">
          <div>{{ data.default }}</div>
        </template>
      </Column>
      <Column header="Controls">
        <template #body="{ data }">
          <FormType
            :type="data.type"
            :value="data.default"
            :more="data.more"
            @change="onChange(data, $event)"
          ></FormType>
        </template>
      </Column>
    </DataTable>
    <DataTable class="y-slots" :value="slotsData" responsiveLayout="scroll">
      <template #header>
        <h2 class="m-0">Slots</h2>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="description" header="Description"></Column>
      <Column header="Default">
        <template #body="{ data }">
          <div>{{ String(data.default) }}</div>
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
const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1);
const { data } = await useFetch(`/api/componentPath?component=${componentName}`);
const componentAST = data.value.componentsAST[0];
console.log(componentAST);
const { props, slots, displayName, description } = componentAST;
const propsData = props.map((item) => {
  let defaultValue = JSON.parse(item.defaultValue.value);
  let type = item.type.name;
  let more = {};
  if (defaultValue === "") {
    defaultValue = "-";
  }
  if (dataType(item.values) === "Array") {
    // defaultValue = item.values;
    more = { options: item.values };
    type = "array";
    console.log(more);
  }
  if (item.tags) {
    // type = item.tags.type[0].description;
    console.log(item.tags.type[0]);
  }
  return {
    name: item.name,
    type,
    more,
    description: item.description,
    default: defaultValue,
  };
});
const slotsData = slots.map((item) => {
  return {
    name: item.name,
    description: item.description,
    default: "",
  };
});
const componentProps = ref({});
const code = computed(() => {
  let _code = `<${componentName}`;
  Object.entries(componentProps.value).map(([key, value]) => {
    _code += ` ${key}="${value}"`;
  });
  _code += `></${componentName}>`;

  return encodeURIComponent(_code);
});
function onChange(data, value) {
  const _componentProps = componentProps.value;
  if (data.default === value) {
    delete _componentProps[data.name];
  } else {
    _componentProps[data.name] = value;
  }

  componentProps.value = _componentProps;
}
</script>
<style scoped>
.y-body {
  padding: 1rem;
}
.y-props {
  margin-top: 2rem;
}
.y-slots {
  margin-top: 2rem;
}
</style>
