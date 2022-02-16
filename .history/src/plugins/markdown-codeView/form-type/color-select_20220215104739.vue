<template>
  <el-cascader :options="options" v-bind="componentProps">
    <template #default="{ node, data }">
      <span :style="node.isLeaf && style(data.label, 1)">{{ value(data.label, 0) }}</span>
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
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
const style = (label, index) => ({
  width: "100%",
  height: "100%",
  backgroundColor: value(label, index),
});
</script>
