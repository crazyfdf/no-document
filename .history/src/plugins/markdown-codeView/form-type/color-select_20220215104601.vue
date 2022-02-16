<template>
  <el-cascader :options="options" v-bind="componentProps">
    <template #default="{ node, data }">
      <span>{{ value(data.label, 0) }}</span>
      <span v-if="!node.isLeaf"> </span>
      <span v-else>
        <div :style="style(data.label, 1)" />
      </span>
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
  width: "50px",
  height: "50px",
  backgroundColor: value(label, index),
});
</script>
