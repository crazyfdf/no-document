<template>
  <component :is="formType" v-model="_value" v-bind="moreProps"></component>
</template>
<script lang="ts" setup>
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
const props = defineProps({
  type: {
    type: String,
    require: true,
  },
  defaultValue: {
    type: String || Boolean || Number,
    require: true,
  },
  moreProps: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["change"]);
const _value = ref(props.defaultValue);
watch(_value, () => {
  emit("change", _value.value);
});
const formType = computed(() => {
  switch (props.type) {
    case "string":
      return InputText;
    case "number":
      return "el-input-number";
    case "boolean":
      return InputSwitch;
    case "date":
      return "el-date-picker";
    case "color":
      return "el-color-picker";
    case "select":
      return "el-select-v2";
    case "progress":
      return Slider;
    case "text":
      return Textarea;
    default:
      return InputText;
  }
});
</script>
<style scoped></style>
