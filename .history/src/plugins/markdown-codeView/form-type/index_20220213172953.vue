<template>
  <component
    :is="formType"
    v-model="value"
    v-bind="const componentProps = computed(() => {
"
  ></component>
</template>
<script lang="ts" setup>
import Textarea from "primevue/textarea";
const props = defineProps({
  type: {
    type: String,
    require: true,
  },
  defaultValue: {
    type: [String, Boolean, Number],
    require: true,
  },
  moreProps: {
    type: Object,
    default: {},
  },
});
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
      return "el-date-picker";
    case "color":
      return "el-color-picker";
    case "select":
      return "el-select-v2";
    case "progress":
      return "el-slider";
    case "text":
      return Textarea;
    default:
      return "el-input";
  }
});
</script>
<style scoped></style>
