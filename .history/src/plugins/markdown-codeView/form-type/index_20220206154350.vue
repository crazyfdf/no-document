<template>
  <component :is="formType" v-model="_value" v-bind="moreProps"></component>
  <!-- <el-select v-model="value" filterable placeholder="Select">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select> -->
  <el-select-v2 v-model="_value" :options="options"></el-select-v2>
</template>
<script lang="ts" setup>
// import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
// import YColorPicker from "primevue/colorpicker";
// import YDropdown from "ant-design-vue/lib/select";
import YDropdown from "primevue/dropdown";
// import { ElSelect, ElOption } from "element-plus";
import { ref } from "vue";
const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
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
      return "el-input-number";
    case "boolean":
      return InputSwitch;
    case "array":
      return MultiSelect;
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
