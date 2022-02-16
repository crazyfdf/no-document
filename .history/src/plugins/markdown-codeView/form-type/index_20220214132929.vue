<template>
  <component
    :style="formTypeStyle"
    :is="formType"
    v-model="value"
    v-bind="componentProps"
  ></component>
</template>
<script lang="ts" setup>
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
const emit = defineEmits(["change"]);
const value = ref(props.defaultValue);
watch(
  () => props.defaultValue,
  () => {
    value.value = props.defaultValue;
  }
);
watch(value, () => {
  emit("change", value.value);
});
const _componentProps = ref({});
const componentProps = computed(() => {
  return {
    ...props.moreProps,
    ..._componentProps.value,
  };
});
const formType = computed(() => {
  switch (props.type) {
    case "string":
      _componentProps.value["autosize"] = true;
      _componentProps.value["clearable"] = true;
      return "el-input";
    case "number":
      return "el-input-number";
    case "boolean":
      return "el-switch";
    case "date":
      _componentProps.value["format"] = "YYYY-MM-DD";
      return "el-date-picker";
    case "color":
      return "el-color-picker";
    case "radio":
      return "el-select-v2";
    case "checkbox":
      _componentProps.value["multiple"] = true;
      return "el-select-v2";
    case "progress":
      return "el-slider";
    case "text":
      _componentProps.value["rows"] = 2;
      _componentProps.value["type"] = "textarea";
      return "el-input";
    default:
      return;
  }
});
</script>
<style scoped></style>
