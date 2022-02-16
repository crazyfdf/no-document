<template>
  <div class="y-body">
    <CodeView
      :path="componentName"
      :code="code"
      :title="displayName"
      :componentProps="componentProps"
      >{{ description }}
    </CodeView>

    <h3 class="y-props">Props</h3>
    <el-table :data="propsData" responsiveLayout="scroll">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column label="Default">
        <template #default="scope">
          <div>{{ scope.default }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Controls">
        <template #default="scope">
          <FormType
            :type="scope.type"
            :default="scope.default"
            :moreProps="scope.moreProps"
            @change="onChange(scope, $event)"
          ></FormType>
        </template>
      </el-table-column>
    </el-table>
    <h3 class="y-slots">Slots</h3>
    <el-table :data="slotsData" responsiveLayout="scroll">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column label="Default">
        <template #default="scope">
          <div>{{ String(scope.default) }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
// import el-table from "primevue/el-table";
// import el-table-column from "primevue/el-table-column";
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
  let moreProps = {};

  if (item.tags?.type) {
    type = item.tags.type[0].description;

    switch (type) {
      case "color":
        break;
      case "select":
        moreProps = { options: item.values.map((item) => ({ label: item, value: item })) };
        break;

      default:
        break;
    }
  }
  return {
    name: item.name,
    type,
    moreProps,
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
  margin-top: 4rem;
}
.y-slots {
  margin-top: 4rem;
}
</style>
