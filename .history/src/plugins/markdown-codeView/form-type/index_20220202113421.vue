<template>
  <component :is="formType" v-model="_value" v-bind="more"></component>
</template>
<script lang="ts" setup>
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
import ColorPicker from "primevue/colorpicker";
import YDropdown from "primevue/dropdown";
import { PropType } from "vue";
type valueType = String | Boolean | Number;
const props = defineProps({
  type: {
    type: String,
    require: true,
  },
  value: {
    type: String || Boolean || Number,
    require: true,
  },
  more: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["change"]);
const _value = ref(props.value);
watch(_value, () => {
  emit("change", _value.value);
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
      return YDropdown;
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
