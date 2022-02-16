<template>
  <NuxtLayout name="component-layout">
    <template #header>
      <h1 id="Code">{{ data.componentAST.displayName }}</h1>
    </template>
    <el-row class="y-components" v-if="!loading">
      <el-col :span="18">
        <client-only>
          <code-view :context="context" :path="path" :code="code" :componentProps="componentProps">
            {{ data.componentAST.description }}
          </code-view>
        </client-only>
        <template v-if="data.componentAST.props">
          <h3 id="Props" class="y-props">Props</h3>
          <el-table :data="propsData" responsiveLayout="scroll">
            <el-table-column label="Name">
              <template #default="{ row }">
                <div :class="[row.required && 'y-required', 'y-props__name']">
                  {{ row.name }}
                  <el-tooltip
                    v-if="row.deprecated"
                    :content="row.deprecated[0].description"
                    placement="top"
                  >
                    <el-icon :size="18">
                      <component :is="TypeComponentsMap['info']" />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="Type"></el-table-column>
            <el-table-column prop="description" label="Description"></el-table-column>
            <el-table-column prop="description" label="Default">
              <template #default="{ row }">
                <div>{{ row.defaultValue ?? "-" }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Control">
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
        </template>
        <template v-if="data.componentAST.slots">
          <h3 id="Slots" class="y-slots">Slots</h3>
          <el-table :data="slotsData" responsiveLayout="scroll">
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="description" label="Description"></el-table-column>
            <el-table-column label="Params">
              <template #default="{ row }">
                <div v-for="param in row.params" :key="param">
                  {{ param ?? "-" }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="data.componentAST.events">
          <h3 id="Emits" class="y-slots">Emits</h3>
          <el-table :data="emitsData" responsiveLayout="scroll">
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="description" label="Description"></el-table-column>
            <el-table-column label="Params">
              <template #default="{ row }">
                <div v-for="param in row.params" :key="param">{{ param ?? "-" }}</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="data.componentAST.methods">
          <h3 id="Methods" class="y-slots">Methods</h3>
        </template>
      </el-col>
      <el-col :span="4">
        <div class="y-contents">
          <h4>CONTENTS</h4>
          <ul class="toc-items">
            <li class="toc-item" v-for="item of contents" :key="item">
              <a class="toc-link" :href="`#${item}`">{{ item }}</a>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import CodeView from "@/plugins/markdown-codeView/code-view/index.vue";
import FormType from "@/plugins/markdown-codeView/form-type/index.vue";
import {
  SuccessFilled,
  InfoFilled,
  WarningFilled,
  CircleCloseFilled,
} from "@element-plus/icons-vue";
const context = import.meta.globEager("/src/components/**/index.vue");
const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1);
const route = useRoute();
const componentName = computed(() => route.params.name as string);
const path = computed(() => `/src/components/${componentName.value}/index.vue`);
const data = ref();
const componentProps = ref({});
const loading = ref(true);
const TypeComponentsMap = {
  success: SuccessFilled,
  warning: WarningFilled,
  error: CircleCloseFilled,
  info: InfoFilled,
};
watch(
  componentName,
  () => {
    loading.value = true;
    init();
  },
  { immediate: true }
);
// 各种类型的默认值
const typeDefault = (type) => {
  switch (type) {
    case "boolean":
      return false;
    case "number":
      return 0;
    case "string":
      return "";
    case "object":
      return {};
    case "array":
      return [];
    case "function":
      return () => {};
    case "symbol":
      return Symbol();
    case "date":
      return new Date();
    case "regexp":
      return /.*/;
    case "checkbox":
      return [];
    case "radio":
      return "";
    default:
      return "";
  }
};
async function init() {
  data.value = (
    await useFetch("/api/componentAST", { params: { component: componentName.value } })
  ).data.value;
  let _componentProps = {};
  data.value.componentAST.props.map((item) => {
    let defaultValue = item.defaultValue
      ? JSON.parse(item.defaultValue.value)
      : typeDefault(item.type.name.toLowerCase());
    if (item.required) {
      _componentProps = Object.assign(_componentProps, { [item.name]: defaultValue });
    }
  });
  console.log(data.value.componentAST);

  componentProps.value = _componentProps;
  loading.value = false;
}

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
    data.value.componentAST.props &&
    data.value.componentAST.props.map((item) => {
      let type = item.type.name.toLowerCase();
      let defaultValue = item.defaultValue
        ? JSON.parse(item.defaultValue.value)
        : typeDefault(type);
      let moreProps = {};

      if (item.tags?.type) {
        type = item.tags.type[0].description;
        switch (type) {
          case "date":
            break;
          case "color":
            moreProps = { showAlpha: true, predefine: predefineColors.value };
            break;
          case "radio":
            item.values =
              item.values || (item.tags.values ? item.tags.values[0].description.split(",") : []);
            moreProps = item.values.length
              ? {
                  options: item.values.map((item) => ({ label: item, value: item })),
                }
              : { options: [] };
            break;
          case "checkbox":
            console.log(defaultValue);

            item.values =
              item.values || (item.tags.values ? item.tags.values[0].description.split(",") : []);
            moreProps = item.values.length
              ? {
                  options: item.values.map((item) => ({ label: item, value: item })),
                }
              : { options: [] };
            break;
          default:
            break;
        }
      }
      return {
        name: item.name,
        required: item.required,
        type,
        moreProps,
        description: item.description,
        defaultValue,
        deprecated: item.tags?.deprecated,
      };
    })
);

const slotsData = computed(
  () =>
    data.value.componentAST.slots &&
    data.value.componentAST.slots.map((item) => {
      let params = [];
      if (item.bindings) {
        item.bindings.forEach((_params) => {
          params.push(
            `${_params.name}: ${_params.type.name}${
              _params.description && ` - ${_params.description}`
            }`
          );
        });
      }
      return {
        name: item.name,
        description: item.description,
        params,
      };
    })
);

const emitsData = computed(
  () =>
    data.value.componentAST.events &&
    data.value.componentAST.events.map((item) => {
      let params = [];
      if (item.properties) {
        item.properties.forEach((_params) => {
          params.push(
            `${_params.name}: ${_params.type.names.join("|")}${
              _params.description && ` - ${_params.description}`
            }`
          );
        });
      }
      return {
        name: item.name,
        description: item.description,
        params,
      };
    })
);

const code = computed(() => {
  let _code = `<${componentName.value}`;
  Object.entries(componentProps.value).map(([key, value]) => {
    const isNotString = dataType(value) !== "String" && dataType(value) !== "Date";
    _code += `\n  ${isNotString ? ":" : ""}${key}="${isNotString ? JSON.stringify(value) : value}"`;
  });
  _code += `>\n</${componentName.value}>`;

  return encodeURIComponent(_code);
});

function onChange(_data, value) {
  const _componentProps = componentProps.value;
  if ((_data.defaultValue === value || value === null) && !_data.required) {
    delete _componentProps[_data.name];
  } else {
    _componentProps[_data.name] = value;
  }
  componentProps.value = _componentProps;
  console.log(value);
}

const contents = computed(() => {
  let _contents = ["Code"];
  let _data = data.value.componentAST;
  _data.props && _contents.push("Props");
  _data.slots && _contents.push("Slots");
  _data.events && _contents.push("Events");
  _data.methods && _contents.push("Methods");
  return _contents;
});
</script>
<style scoped>
.y-props {
  margin-top: 4rem;
}
.y-slots {
  margin-top: 4rem;
}
.y-components {
  display: flex;
  justify-content: space-between;
}
.y-contents {
  position: fixed;
  opacity: 0.7;
}
.y-props__name {
  display: flex;
  align-items: center;
}
.y-required::before {
  content: "*";
  color: red;
  margin-right: 4px;
  font-size: 16px;
}
.toc-items {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  line-height: 1.2;
}
.toc-item {
  margin-top: 10px;
  font-size: 11px;
  color: #909399;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: inherit;
}
.toc-link {
  position: relative;
  color: #909399;
}
</style>
