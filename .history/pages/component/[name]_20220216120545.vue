<template>
  <NuxtLayout name="component-layout">
    <template #header>
      <h1 id="Code">{{ componentAST.displayName }}</h1>
    </template>
    <el-row class="y-components" v-if="!loading">
      <el-col :span="18">
        <client-only>
          <code-view :context="context" :path="path" :code="code" :componentProps="componentProps">
            {{ componentAST.description }}
          </code-view>
        </client-only>
        <template v-if="componentAST.props">
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
        <template v-if="componentAST.slots">
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
        <template v-if="componentAST.events">
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
        <template v-if="componentAST.methods">
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
import uiColor from "./ui/ui-color";
import uiFont from "./ui/ui-font";
import typeDefault from "./typeDefault";
import { ComponentDoc } from "vue-docgen-api";
const context = import.meta.globEager("/src/components/**/index.vue");
const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1);
const route = useRoute();
const componentName = computed(() => route.params.name as string);
const path = computed(() => `/src/components/${componentName.value}/index.vue`);
const componentAST = useState<ComponentDoc>("componentAST");
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

async function init() {
  const { data } = await useFetch("/api/componentAST", {
    params: { component: componentName.value },
  });
  componentAST.value = data.value.componentAST;
  let _componentProps = {};
  componentAST.value.props.map((item) => {
    let defaultValue = item.defaultValue
      ? JSON.parse(item.defaultValue.value)
      : typeDefault(item.type.name.toLowerCase());
    if (item.required) {
      _componentProps = Object.assign(_componentProps, { [item.name]: defaultValue });
    }
  });
  console.log(componentAST.value);

  componentProps.value = _componentProps;
  loading.value = false;
}
const _uiColor = [];
Object.entries(uiColor).forEach(([key, value]) => {
  Object.values(value).forEach((item) => {
    _uiColor.push(item);
  });
});
const colorType = ["text", "border", "background"];

const _uiColorSelect = colorType.map((item) => {
  return {
    label: item,
    value: item,
    children: Object.entries(uiColor).map(([key, value]) => {
      return {
        label: key,
        value: key,
        children: Object.entries(value).map(([key, value]) => {
          return {
            label: `${key} ${value}`,
            value: key,
          };
        }),
      };
    }),
  };
});
const propsData = computed(
  () =>
    componentAST.value.props &&
    componentAST.value.props.map((item) => {
      let type = item.type.name.toLowerCase();
      let defaultValue = item.defaultValue
        ? JSON.parse(item.defaultValue.value)
        : typeDefault(type);
      let moreProps = {};
      if (item.tags?.input) {
        moreProps = {
          ...moreProps,
          ...item.tags.input[0].description.split(",").reduce((pre, cur) => {
            let [key, value] = cur.split("=");
            return {
              ...pre,
              [key]: JSON.parse(value),
            };
          }, {}),
        };
      }
      if (item.tags?.type) {
        type = item.tags.type[0].description;
        switch (type) {
          case "date":
            break;
          case "color":
            moreProps = Object.assign(moreProps, {
              showAlpha: true,
              predefine: _uiColor,
            });
            break;
          case "font":
            moreProps = Object.assign(moreProps, {
              options: Object.keys(uiFont).map((item) => ({ label: item, value: `text-${item}` })),
            });
            break;
          case "radio":
            item.values =
              item.values || (item.tags.values ? item.tags.values[0].description.split(",") : []);

            moreProps = Object.assign(moreProps, {
              options: item.values.map((item) => ({ label: item, value: item })),
            });
            break;
          case "checkbox":
            item.values =
              item.values || (item.tags.values ? item.tags.values[0].description.split(",") : []);
            moreProps = Object.assign(moreProps, {
              options: item.values.map((item) => ({ label: item, value: item })),
            });
            break;
          case "colorSelect":
            moreProps = Object.assign(moreProps, {
              options: _uiColorSelect,
            });
            break;
          case "cascader":
            item.values =
              item.values || (item.tags.values ? item.tags.values[0].description.split(",") : []);
            moreProps = Object.assign(moreProps, {
              options: item.values.map((_item) =>
                _item
                  .split("/")
                  .reverse()
                  .reduce(
                    (pre, cur) => ({
                      label: cur,
                      value: cur,
                      children: [pre],
                    }),
                    {}
                  )
              ),
            });
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
    componentAST.value.slots &&
    componentAST.value.slots.map((item) => {
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
    componentAST.value.events &&
    componentAST.value.events.map((item) => {
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
}

const contents = computed(() => {
  let _contents = ["Code"];
  let _data = componentAST.value;
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
.y-required::after {
  content: "*";
  color: red;
  margin-left: 4px;
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
