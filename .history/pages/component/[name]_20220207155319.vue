<template>
  <NuxtLayout name="component-layout">
    <template #header>
      <div class="y-title">{{ displayName }}</div>
    </template>
    <div>
      <code-view :path="componentName" :code="code" :componentProps="componentProps"
        >{{ description }}
      </code-view>

      <h3 class="y-props">Props</h3>
      <el-table :data="propsData" responsiveLayout="scroll" v-if="props">
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
      <el-table :data="slotsData" responsiveLayout="scroll" v-if="slots">
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="description" label="Description"></el-table-column>
        <el-table-column label="Default">
          <template #default="{ row }">
            <div>{{ row.default }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import CodeView from "@/plugins/markdown-codeView/code-view/index.vue";
import FormType from "@/plugins/markdown-codeView/form-type/index.vue";
const route = useRoute();
const componentName = route.params.name as string;
const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1);
const { data } = await useFetch(`/api/componentAST?component=${componentName}`);
const componentAST = data.value.componentsAST[0];
console.log(componentAST);
const { props, slots, displayName, description } = componentAST;
const propsData =
  props &&
  computed(() =>
    props.map((item) => {
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
const slotsData =
  slots &&
  computed(() =>
    slots.map((item) => {
      return {
        name: item.name,
        description: item.description,
        default: "",
      };
    })
  );
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
