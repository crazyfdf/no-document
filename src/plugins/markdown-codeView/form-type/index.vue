<template>
  <component
    :style="formTypeStyle"
    :is="formType"
    v-model="value"
    :componentProps="componentProps"
    v-bind="componentProps"
    @input="inputChange"
  ></component>
</template>
<script lang="ts" setup>
import ColorSelect from "./color-select.vue";
const props = withDefaults(
  defineProps<{
    type: string;
    defaultValue: any;
    moreProps?: object;
  }>(),
  {}
);
const formTypeStyle = {
  width: "100%",
};
function inputChange(_value) {
  value.value = _value;
}
const emit = defineEmits(["change"]);
const value = ref(props.defaultValue);
watch(
  () => props.defaultValue,
  () => {
    value.value = props.defaultValue;
  }
);
watch(value, () => {
  console.log(value.value);

  emit("change", value.value);
});
const _componentProps = ref({});
const componentProps = computed(() => {
  return {
    ..._componentProps.value,
    ...props.moreProps,
  };
});
const formType = computed(() => {
  switch (true) {
    case props.type === "string":
      _componentProps.value["clearable"] = true;
      return "el-input";
    case props.type === "number":
      return "el-input-number";
    case props.type === "boolean":
      return "el-switch";
    case props.type === "date":
      _componentProps.value["format"] = "YYYY-MM-DD";
      return "el-date-picker";
    case ["color"].includes(props.type):
      return "el-color-picker";
    case ["font", "radio"].includes(props.type):
      return "el-select-v2";
    case props.type === "checkbox":
      _componentProps.value["multiple"] = true;
      return "el-select-v2";
    case props.type === "progress":
      return "el-slider";
    case props.type === "colorSelect":
      _componentProps.value["separator"] = "-";
      return ColorSelect;
    case props.type === "cascader":
      return "el-cascader";
    default:
      return;
  }
});
</script>
<style scoped></style>
