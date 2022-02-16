<template>
  <el-cascader :options="options" v-bind="componentProps">
    <template #default="{ node, data }">
      <span>{{ value(data.label, 0) }}</span>
      <span v-if="!node.isLeaf"> </span>
      <span v-else>
        <ColorPicker :defaultColor="value(data.label, 1)" :inline="true" />
      </span>
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
import ColorPicker from "primevue/colorpicker";
defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  componentProps: {
    type: Object,
    default: () => ({}),
  },
});
const value = (label, index) => {
  return label.split(" ")[index];
};
</script>
