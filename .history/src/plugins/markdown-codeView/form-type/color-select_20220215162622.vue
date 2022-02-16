<template>
  <el-cascader :options="options" v-bind="componentProps" @change="change">
    <template #default="{ node, data }">
      <div :style="node.isLeaf && style(data.label, 1)">{{ _label(data.label, 0) }}</div>
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
const emit = defineEmits(["input"]);
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
const _label = (label, index) => {
  return label.split(" ")[index];
};
const style = (label, index) => ({
  width: "100%",
  height: "100%",
  backgroundColor: _label(label, index),
});
function change(value) {
  console.log(value.join("-"));
  emit("input", value.join("-"));
}
</script>
