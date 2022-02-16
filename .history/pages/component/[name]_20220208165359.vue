<template>
  <NuxtLayout name="component-layout">
    <template #header>
      <div class="y-title">{{ data.componentsAST[0].displayName }}</div>
    </template>
    <code-view :path="componentName" :code="code" :componentProps="componentProps">
      {{ data.componentsAST[0].description }}
    </code-view>

    <h3 class="y-props">Props</h3>
    <el-table :data="propsData" responsiveLayout="scroll">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column label="Default">
        <template #default="{ row }">
          <div>{{ row.defaultValue }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Controls">
        <template #default="{ row }">
          <form-type
            :type="row.type"
            :defaultValue="row.defaultValue"
            :moreProps="row.moreProps"
            @change="onChange(row, $event)"
          ></form-type>
        </template>
      </el-table-column>
    </el-table>
    <h3 class="y-slots">Slots</h3>
    <el-table :data="slotsData" responsiveLayout="scroll">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column label="Default">
        <template #default="{ row }">
          <div>{{ row.default }}</div>
        </template>
      </el-table-column>
    </el-table>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import CodeView from "@/plugins/markdown-codeView/code-view/index.vue";
import FormType from "@/plugins/markdown-codeView/form-type/index.vue";
const route = useRoute();
const componentName = computed(() => route.params.name as string);
const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1);
let { data } = await useFetch(`/api/componentAST?component=${componentName.value}`);
watch(componentName, () => {
  init();
});
async function init() {
  data.value = (await useFetch(`/api/componentAST?component=${componentName.value}`)).data.value;
  componentProps.value = {};
}
const propsData = computed(
  () =>
    data.value.componentsAST[0].props &&
    data.value.componentsAST[0].props.map((item) => {
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
        defaultValue,
      };
    })
);
const slotsData = computed(
  () =>
    data.value.componentsAST[0].slots &&
    data.value.componentsAST[0].slots.map((item) => {
      return {
        name: item.name,
        description: item.description,
        default: "",
      };
    })
);
const componentProps = ref({});
const code = computed(() => {
  let _code = `<${componentName.value}`;
  Object.entries(componentProps.value).map(([key, value]) => {
    _code += ` ${key}="${value}"`;
  });
  _code += `></${componentName.value}>`;

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
.y-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.y-props {
  margin-top: 4rem;
}
.y-slots {
  margin-top: 4rem;
}
</style>
