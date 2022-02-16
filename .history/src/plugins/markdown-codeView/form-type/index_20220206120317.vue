<template>
  <div>
    <component :is="formType" v-model="_value" v-bind="moreProps"></component>
  </div>
</template>
<script lang="ts" setup>
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
import YColorPicker from "primevue/colorpicker";
import YDropdown from "ant-design-vue/lib/select";
// import YDropdown from "primevue/dropdown";
const selectedCity1 = ref();
const cities = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
const props = defineProps({
  type: {
    type: String,
    require: true,
  },
  default: {
    type: String || Boolean || Number,
    require: true,
  },
  moreProps: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["change"]);
const _value = ref(props.default);
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
      return YColorPicker;
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
