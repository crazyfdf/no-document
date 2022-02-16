<template>
  <NuxtLayout name="component-layout">
    <template #header>
      <h1>{{ data.componentsAST[0].displayName }}</h1>
    </template>
    <el-row :gutter="100">
      <el-col :span="18">
        <code-view :path="componentName" :code="code" :componentProps="componentProps">
          {{ data.componentsAST[0].description }}
        </code-view>

        <h3 id="Props" class="y-props">Props</h3>
        <el-table :data="propsData" responsiveLayout="scroll">
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column prop="type" label="Type"></el-table-column>
          <el-table-column prop="description" label="Description"></el-table-column>
          <el-table-column label="Default">
            <template #default="{ row }">
              <div>{{ row.defaultValue ?? "-" }}</div>
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
        </el-table>
        <h3 class="y-slots">Emits</h3>
        <h3 class="y-slots">Functions</h3>
      </el-col>
      <el-col :span="4">
        <h3>CONTENTS</h3>
        <ul>
          <li v-for="item of contents" :key="item">
            <a :href="`#${item}`">{{ item }}</a>
          </li>
        </ul>
      </el-col>
    </el-row>
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
console.log(data.value.componentsAST[0]);
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
const propsData = computed(
  () =>
    data.value.componentsAST[0].props &&
    data.value.componentsAST[0].props.map((item) => {
      let defaultValue = item.defaultValue && JSON.parse(item.defaultValue.value);
      let type = item.type.name;
      let moreProps = {};
      if (item.tags?.type) {
        type = item.tags.type[0].description;
        switch (type) {
          case "color":
            moreProps = { showAlpha: true, predefine: predefineColors.value };
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
    _code += `\n  ${key}="${value}"`;
  });
  _code += `>\n</${componentName.value}>`;

  return encodeURIComponent(_code);
});
function onChange(_data, value) {
  const _componentProps = componentProps.value;
  if (_data.defaultValue === value || value === null) {
    delete _componentProps[_data.name];
  } else {
    _componentProps[_data.name] = value;
  }
  componentProps.value = _componentProps;
}
const contents = ref(["Components", "Props", "Slots", "Emits", "Functions"]);
</script>
<style scoped>
.y-props {
  margin-top: 4rem;
}
.y-slots {
  margin-top: 4rem;
}
.y-contents {
  display: flex;
  justify-content: space-between;
}
</style>
