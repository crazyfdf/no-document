<template>
  <component :is="formType"></component>
</template>
<script lang="ts" setup>
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
import ColorPicker from "primevue/colorpicker";
import Dropdown from "primevue/dropdown";
const props = defineProps({
  type: {
    type: String,
    require: true,
  },
});
const formType = computed(() => {
  switch (props.type) {
    case "string":
      return InputText;
    case "number":
      return InputNumber;
    case "boolean":
      return InputSwitch;
    case "array":
      return MultiSelect;
    case "color":
      return ColorPicker;
    case "select":
      return Dropdown;
    case "progress":
      return Slider;
    case "text":
      return Textarea;
    default:
      return InputNumber;
  }
});
</script>
<style scoped></style>
